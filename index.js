const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const http = require("http");
const sharedsession = require("express-socket.io-session");
const log = console.log;
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const connection = require("./DB/Index");
const TokenGenerator = require("./Routes/Token");
const AuthRoute = require("./Routes/Authentication");
const data = require("./Routes/Data.js");
const Messages = require("./Routes/Messages.js");
const UpdateUserStates = require("./Routes/UpdateUserStates.js");
const VideoPlayer = require("./Routes/StreamingVideo.js");
const PORT = process.env.PORT || 3000;
const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");
const path = require("path");
const e = require("cors");
const appID = "234a76013200476483700abafcdbc559";
const appCertificate = "efbf884cee804ad39967d94eee86675b";
const uid = 0;
const expirationTimeInSeconds = 3600;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload());
app.use("/Token", TokenGenerator);
app.use("/Auth", AuthRoute);
app.use("/data", data);
app.use("/Messages", Messages);
app.use("/VideoPlayer", VideoPlayer);
app.use("/UpdateState", UpdateUserStates);
const { getFileStream } = require("./s3");
const { Console } = require("console");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/uploads/:key", (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});
var session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true,
});
io.use(
  sharedsession(session, {
    autoSave: true,
  })
);
io.use(function (socket, next) {
  next();
});
io.on("connection", (socket) => {
  socket.on("StrtConnection", (id) => {
    socket.handshake.session.UserId = id;
  });
  socket.on("Connect", (e) => {
    socket.join([
      e.hashId != "undefined"
        ? e.hashId
        : e.ReceiverId != "undefined"
        ? e.ReceiverId
        : "none",
      e.UserId != "undefined" ? e.UserId : "none",
    ]);
    socket.on("Send", (Content) => {
      saveMessagetoDb(Content);
      socket.to(Content.hashId).to(Content.ReceiverId).emit("Send", Content);
    });

    socket.on("newCall", (Content) => {
      log(Content);
      socket.to(Content.ReceiverId).emit("newCall", Content);
    });
    socket.on("CallResponse", async (Content) => {
      socket.handshake.session.StartDate = new Date();
      socket.handshake.session.save();
      const channel = `${Content.userId}-channelcall-${Content.receiverId}`;
      const token = await Token(channel, RtcRole.PUBLISHER);
      socket.to(Content.userId).to(Content.ReceiverId).emit("CallResponse", {
        Token: token,
        channel: channel,
        userId: Content.userId,
        receiverId: Content.receiverId,
        Answer: Content.Answer,
      });
    });
    socket.on("EnCall", (callinfo) => {
      io.to(callinfo.receiverId).to(callinfo.SenderId).emit("EnCall", -1);
      saveMessagetoDb({
        contentImage: "",
        contentText: "",
        contentAudio: "",
        giftCoins: 0,
        SenderId: callinfo.SenderId,
        receiverId: callinfo.receiverId,
        Hash_id: "",
        Duration: callinfo.Duration,
      });
    });
  });
  socket.on("CallQueue", async (req) => {
    let enter;
    socket.handshake.session.UserId = req.id;
    socket.handshake.session.save();
    try {
      enter = await EnterCallueue(req.id, req.into);
      console.table(["Entrer", enter]);
    } catch (err) {
      log(err);
    }
    if (enter) {
      socket.join(req.id);
      const UserID = await GetRandomUsers(req.UserGender, req.into, req.id);
      const channel = `${req.id}-channel-call-${UserID}`;
      const token = await Token(channel, RtcRole.PUBLISHER);
      if (UserID) {
        try {
          AddToHistory(req.id, UserID);
        } catch (err) {}
        io.to(req.id).to(UserID).emit("CallQueueRes", {
          FUserID: req.id,
          SUserID: UserID,
          Token: token,
          Channel: channel,
        });
      }
      socket.on("Gift", async (Gift) => {
        console.table(["Gift", Gift]);
        await MakeTransiction(Gift.id, Gift.reciver, Gift.amount);
        io.to(Gift.id).to(Gift.reciver).emit("Gift", {
          amount: Gift.amount,
          username: Gift.username,
          id: Gift.id,
        });
      });
      socket.on("end", async (req) => {
        try {
          await endCallueue(req.id);
        } catch (err) {}
      });
      socket.on("ExitQueue", async (req) => {
        console.log("ExitQueue Called ");

        try {
          await endCallueue(req.id);
          io.to(UserID).emit("ExitQueue", -1);
        } catch (err) {
          console.log("Exite Err" + err);
        }
      });
    }
  });
  socket.on("StreamChat", async (LiveChannel) => {
    socket.join(LiveChannel);
    socket.on("join", async (userId) => {
      const data = await GetComment(LiveChannel);
      io.to(LiveChannel).emit("NumberOfAudience", {
        NumberOfAudience: socket.adapter.rooms.get(LiveChannel).size,
        comments: data,
      });
    });

    socket.on("leave", (UserId) => {
      if (UserId != null && UserId == LiveChannel) {
        EndLiveStream(UserId);
        io.to(LiveChannel).emit("NumberOfAudience", {
          NumberOfAudience: -1,
        });
      } else
        io.to(LiveChannel).emit("NumberOfAudience", {
          NumberOfAudience: socket.adapter.rooms.get(LiveChannel).size,
        });
    });

    socket.on("Comment", async (Comment) => {
      const IsSuccessfulTransiction = await MakeTransiction(
        Comment.SenderId,
        parseInt(LiveChannel),
        Comment.Gift
      );
      if (IsSuccessfulTransiction == 0) {
        connection.query(
          `insert into livechatcomments(Username,Message,Gift,channelId)values(?,?,?,?);`,
          [Comment.Username, Comment.Message, Comment.Gift, LiveChannel],
          (err, results, fields) => {
            if (err) reject(err);
          }
        );
        io.to(LiveChannel).emit("Comment", Comment);
      }
    });
  });
  socket.on("disconnect", async () => {
    try {
      const endqueue = await endCallueue(socket.handshake.session.UserId);
      const endlive = await EndLiveStream(socket.handshake.session.UserId);
      const endstate = await ChangeToOfline(socket.handshake.session.UserId);
    } catch (err) {}
  });
});

/**
 *
 * @param {String} UserGender
 * @param {String} into
 * @param {number} id
 * @returns random user id from table that has entrest in gender of this user and this user has same genderporeference as the random user
 */
const GetRandomUsers = (UserGender, into, id) => {
  log(UserGender + " : " + into + " : " + id);
  return new Promise((res, rej) => {
    connection.query(
      `SELECT callqueue.*  FROM callqueue inner join user on callqueue.Userid = user.idUser
        where callqueue.isbussy = false 
        and (user.gender = ? or user.gender = ? or user.gender =?)
        and callqueue._Into=? 
        and callqueue.Userid!=?
        ORDER BY RAND()
        LIMIT 1`,
      [
        into == "both" ? "Famel" : into,
        into == "both" ? "Male" : into,
        into == "both" ? "" : into,
        UserGender == "" || UserGender == null || UserGender == "undefined"
          ? "both"
          : UserGender,
        id,
      ],
      (err, result, fields) => {
        log({ result: result });
        if (err) {
          log(err);
          rej(null);
        } else if (result.length != 0) {
          res(result[0].Userid);
        }
      }
    );
  });
};
/**
 *
 * @param {number} id
 * @returns {Array.LiveChatComments} retun data from mysql database contain comments
 */
const GetComment = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from livechatcomments where channelId =?`,
      [id],
      (err, results, fields) => {
        if (err) reject(err);

        resolve(results);
      }
    );
  });
};
/**
 *
 * @param {int} SenderId
 * @param {int} ReciverId
 * @param {number} amount
 * @returns
 */
const MakeTransiction = (SenderId, ReciverId, amount) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `call MakeTransiction(?,?,?);`,
      [SenderId, ReciverId, amount],
      (err, results, fields) => {
        if (err) reject(err);
        resolve(
          results[0][0].res != "undefined" && results[0][0].res != null
            ? results[0][0].res
            : 0
        );
      }
    );
  });
};
/**
 *
 * @param {String} channelName
 * @param {number} role
 * @returns
 */
const Token = (channelName, role) => {
  return new Promise((res, rej) => {
    res(
      RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channelName,
        uid,
        role,
        privilegeExpiredTs
      )
    );
  });
};
/**
 *
 * @param {MessageContent} Content
 * @description takes Message from socket emmit and save it to mysql database
 */
const saveMessagetoDb = (Content) => {
  connection.query(
    `call SendMesage(?,?,?,?,?,?,?,?);`,
    [
      Content.contentImage,
      Content.contentText,
      Content.contentAudio,
      Content.giftCoins,
      Content.SenderId,
      Content.receiverId,
      Content.Hash_id == null || Content.Hash_id == "undefined"
        ? ""
        : Content.Hash_id,
      Content.Duration == null || Content.Duration == "undefined"
        ? 0
        : Content.Duration,
    ],
    (err, Rows, field) => {
      if (err) {
      }
    }
  );
};
/**
 *
 * @param {int} FuserId one user id
 * @param {int} sUserId other user id
 * @description added match history to table in mysql
 */
const AddToHistory = (FuserId, sUserId) => {
  connection.query(
    `insert into matchhistory(FirstUserID,SecondtUserID)values(?,?)`,
    [FuserId, sUserId],
    (err, res, field) => {
      if (err) return err;
    }
  );
};
/**
 *
 * @param {int} userid the user id
 * @param {enum} into gender preference
 * @returns return nonNull value if opratiopn is succeeded
 */
const EnterCallueue = (userid, into) => {
  return new Promise((res, rej) => {
    connection.query(
      `insert into callqueue(Userid,_Into,isbussy) value(?,?,false);`,
      [userid, into],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          rej(null);
        } else res(result);
      }
    );
  });
};
/**
 *
 * @param {int} userid
 * @returns
 */
const endCallueue = (id) => {
  console.log(`user ${id} Leaveed the call`);
  return new Promise((res, rej) => {
    connection.query(
      `delete from callqueue where Userid =?`,
      [id],
      (err, result, fields) => {
        if (err) {
          console.log("end call failled " + err);
          rej(null);
        } else res(result);
      }
    );
  });
};

/**
 *
 * @param {int} id
 * @returns
 */
const EndLiveStream = (id) => {
  return new Promise((res, rej) => {
    connection.query(
      `delete from livechatcomments where channelId =?`,
      [id],
      (err, results, field) => {
        if (err) rej(err);
        connection.query(
          `update user set user.IsStreaming = false where idUser =?`,
          [id],
          (err, rows, field) => {
            if (err) {
              rej(err);
            }
            res(rows);
          }
        );
      }
    );
  });
};

/**
 *
 * @param {int} userId
 * @returns
 */
const ChangeToOfline = (userId) => {
  return new Promise((res, rej) => {
    connection.query(
      `delete from LiveChatComments where channelId =?`,
      [id],
      (err, results, field) => {
        if (err) return err;
        res(results);
      }
    );
  });
};
/**
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns Deferent between dates in seconds
 */
const getDateDeferent = (startDate, endDate) => {
  return Math.round((endDate.getTime() - startDate.getTime()) / 1000);
};
server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
