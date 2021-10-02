const express = require("express");
let mysql = require("mysql");
const Router = express.Router();
const connection = require("../DB/Index.js");
const Config = require("../Config/Config");
const multer = require("multer");
const BaseUrl = Config.BaseUrl;
const { uploadFile } = require("../s3");
Router.post("/GetUserInfo", (req, res) => {
  console.table([req.body.idUser]);
  let sqlQuery = `select * from user where idUser =${mysql.escape(
    req.body.idUser
  )}`;
  connection.query(sqlQuery, (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      const user = rows[0];
      if (typeof user !== "undefined") {
        res.send(user);
      } else {
        res.status(403).send("Undefined");
      }
    }
  });
});

Router.post("/GetUserFriends", (req, res) => {
  let sqlQuery = `select user.* from favorite inner join user on favorite.idfavorite 
  = user.idUser where favorite.user_idUser=${mysql.escape(req.body.idUser)}`;
  connection.query(sqlQuery, (err, rows, fields) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send(rows);
    }
  });
});
Router.get("/GetUsers", (req, res) => {
  let query = "";
  if (req.query.country == null) {
    query = `select * from user
where IsStreaming=true or 
idUser in(select stories.user_idUser
  from stories where stories.uploadTime > DATE_ADD(now(),interval -1 day))
and idUser!=${mysql.escape(req.query.userId)} `;
  } else {
    query = `select * from user
 where IsStreaming=true or 
 idUser in(select stories.user_idUser
  from stories where stories.uploadTime > DATE_ADD(now(),interval -1 day))
  and country =${mysql.escape(req.query.country)} and idUser!=${mysql.escape(
      req.query.userId
    )} `;
  }

  connection.query(query, (err, rows, fields) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send(rows);
    }
  });
});

Router.get("/GetAllCountries", (req, res) => {
  connection.query(
    ` select country from user where IsStreaming=true 
  or idUser in(select user_idUser from stories) and idUser!=?
   group by country  order by count(idUser)  desc;  `,
    [req.query.UserId],
    (err, rows, fields) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(rows);
      }
    }
  );
});

Router.get("/GetAllUsers", (req, res) => {
  let sqlQuery = `select * from user`;
  connection.query(sqlQuery, (err, rows, fields) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send(rows);
    }
  });
});
Router.get("/PurchaseCoins", (req, res) => {
  connection.query(
    `update user set coins = coins+? where idUser = ?`,
    [req.query.amount, req.query.UserId],
    (err, rows, fields) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(rows);
      }
    }
  );
});
Router.post("/DeleteUser", (req, res) => {
  console.log(req.body.id);
  connection.query(
    `update  user set activationStatus=false where idUser = ?`,
    [req.body.id],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        console.log("Succuse");
        res.send(rows);
      }
    }
  );
});

Router.get("/GetPosts", (req, res) => {
  let sqlQuery = `select * from posts where publisherId = ${mysql.escape(
    req.query.Pub
  )};`;
  connection.query(sqlQuery, (err, rows, fields) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send(rows);
    }
  });
});
Router.delete("/RemoveUserToFriends", (req, res) => {
  let sqlQuery = `delete from  favorite where idfavorite=${mysql.escape(
    req.query.Fav
  )} ANd user_idUser=${mysql.escape(req.query.User)};
  `;
  connection.query(sqlQuery, (err, rows, fields) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});

Router.get("/addUserToFriends", (req, res) => {
  let sqlQuery = `insert into favorite(idfavorite,user_idUser)values(${mysql.escape(
    req.query.Fav
  )},${mysql.escape(req.query.User)});`;
  connection.query(sqlQuery, (err, rows, fields) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  });
});
Router.get("/NumberOfFlowers", (req, res) => {
  connection.query(
    `select count(idfavorite)as NumberOfFlowers from favorite where idfavorite=?`,
    [req.query.userid],
    (err, rows, fields) => {
      if (err) return res.status(404).send(err);
      res.status(200).send("" + rows[0].NumberOfFlowers);
    }
  );
});

Router.get("/CheckFriends", (req, res) => {
  let sqlQuery = `select count(*) As num from favorite where  idfavorite =${mysql.escape(
    req.query.Fav
  )} And user_idUser=${mysql.escape(req.query.User)}; `;
  connection.query(sqlQuery, (err, result, fields) => {
    if (err) {
      res.sendStatus(404);
    } else {
      console.table([result, req.query.Fav, req.query.User]);
      if (
        result[0].num != null &&
        result[0].num != "undefined" &&
        result[0].num > 0
      ) {
        res.sendStatus(200);
      } else res.sendStatus(403);
    }
  });
});
const GetStoryContent = (day, userId) => {
  return new Promise((resolve, rejects) => {
    const ContentQuery = `SELECT * from stories where Day(stories.uploadTime) =  ${mysql.escape(
      day
    )} and stories.user_idUser =${mysql.escape(userId)};
        `;
    connection.query(ContentQuery, (err, Rows, fields) => {
      if (err) return res.status(500).send(err);
      resolve(Rows);
    });
  });
};

const GetAllStories = async (rows) => {
  const data = [];
  let i = 0;
  for (let row of rows) {
    const item = await GetStoryContent(row.day, row.idUser);
    data.push({
      idUser: rows[i].idUser,
      name: rows[i].name,
      profileImage: rows[i].profileImage,
      Content: item,
    });
    i++;
  }
  // await Promise.all([...data.map((row) => GetStoryContent(24, 1))]);
  return data;
};
Router.get("/GetStories", async (req, res) => {
  console.table([{ gettingStoryatid: req.query.UserId }]);
  let sqlQuery = `select user.idUser, user.name , user.profileImage 
  ,Day(stories.uploadTime) as 'day' from stories inner join user on stories.user_idUser = user.idUser
  where user.idUser =${mysql.escape(req.query.UserId)}
  group by user.idUser,user.name , user.profileImage ,DAY(stories.uploadTime);`;
  connection.query(sqlQuery, async (err, result, fields) => {
    if (err) {
      res.sendStatus(404);
    } else {
      const data = await GetAllStories(result);
      res.send(data);
    }
  });
});
Router.get("/MakeTransaction", async (req, res) => {
  const Res = await MakeTransiction(
    req.query.SenderId,
    req.query.ReciverId,
    req.query.amount
  );
  if (Res == 1) return res.status(200).send("OK");
  res.status(403).send("Failed");
});
Router.get("/matchHistory", async (req, res) => {
  connection.query(
    `select  FirstUserID,SecondtUserID
    from matchhistory
    where FirstUserID=? or SecondtUserID =?
    group by FirstUserID,SecondtUserID`,
    [req.query.userId, req.query.userId],
    async (err, result, fields) => {
      if (err) return res.status(500).send(err);
      let Users = await GetAllUsers(result, req.query.userId);
      const ids = Users.map((o) => o.idUser);
      const filtered = Users.filter(
        ({ idUser }, index) => !ids.includes(idUser, index + 1)
      );
      res.status(200).send(filtered);
    }
  );
});

Router.post("/UpdateUser", async (req, res) => {
  connection.query(
    `update user set user.name=${mysql.escape(req.body.name)},
    user.about =${mysql.escape(req.body.about)},
    user.age =${mysql.escape(req.body.age)},
    user.job =${mysql.escape(req.body.job)},
    user.education =${mysql.escape(req.body.education)}
     where idUser=${mysql.escape(req.body.idUser)}`,
    async (err, result, fields) => {
      if (err) return res.status(500).send(err);
      const user = await GetUserById(req.body.idUser);
      res.status(200).send(user);
    }
  );
});

const GetAllUsers = async (rows, Userid) => {
  const data = [];
  for (let row of rows) {
    const item = await GetUserById(
      row.FirstUserID == Userid ? row.SecondtUserID : row.FirstUserID
    );
    console.log(item);
    data.push(item);
  }
  console.log(data);
  return data;
};

const GetUserById = (userId) => {
  return new Promise((resolve, rejects) => {
    connection.query(
      ` select * from user where idUser =?`,
      [userId],
      (err, Rows, fields) => {
        if (err) return res.status(500).send(err);
        resolve(Rows[0]);
      }
    );
  });
};

Router.get("/MakeTransactionToSystem", async (req, res) => {
  connection.query(
    `call MakeTransictionToSystem(?,?);`,
    [req.query.SenderId, req.query.amount],
    (err, results, fields) => {
      if (err) return res.status(500).send(err);
      if (results[0][0].res == 0) return res.status(200).send("OK");
      else return res.status(500).send(results);
    }
  );
});

/**
 *
 *
 *
 */
Router.post("/UploadImages", async (req, res) => {
  let File;
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("err no file");
    return res.sendStatus(403);
  }
  File = req.files.fileName;
  const result = await uploadFile(File);
  let url = `${BaseUrl}uploads/${result.key}`;
  connection.query(
    `insert into posts(publisherId,ContentImg)values(?,?)`,
    [req.body.id, url],
    (err, url) => {
      if (!err) {
        res.sendStatus(200);
      } else {
        res.status(500).send("DB" + err);
      }
    }
  );
});
Router.post("/UpdateProfileImage", async (req, res) => {
  let File;
  let Path;
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("err no file");
    return res.sendStatus(403);
  }
  File = req.files.fileName;
  const result = await uploadFile(File);
  let url = `${BaseUrl}uploads/${result.key}`;
  connection.query(
    `update  user set profileImage =? where idUser=?;`,
    [url, req.body.id],
    (err, url) => {
      if (!err) {
        res.sendStatus(200);
      } else {
        res.status(500).send("DB" + err);
      }
    }
  );
});

//Stories
Router.post("/UploadStories", async (req, res) => {
  let File;
  let Path;
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("err no file");
    return res.sendStatus(403);
  }
  File = req.files.fileName;
  const result = await uploadFile(File);
  let url = `${BaseUrl}uploads/${result.key}`;
  connection.query(
    `insert into stories(mediaUrl,mimeType,uploadTime,user_idUser)values(?,?,Now() ,?)`,
    [url, req.body.mimeType, req.body.id],
    (err, result, fields) => {
      if (err) return res.status(500).send("DB" + err);
      if (req.body.mimeType == "video") return res.status(200).send(File.name);
      return res.status(200).send(url);
    }
  );
  // res.send({ imagePath: `/images/${result.Key}` });
});
/**
 *
 */
Router.get("/Enter_Exit_CallQueue", (req, res) => {
  if (req.query.isEnter == "true")
    connection.query(
      `insert into callqueue(Userid,_Into,isbussy) value(?,?,false);`,
      [req.query.userId, req.query.into],
      (err, result, fields) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(result);
      }
    );
  else
    connection.query(
      `delete from callqueue where Userid = 10;`,
      [req.query.userId],
      (err, result, fields) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(result);
      }
    );
});

Router.get("/GiftList", (req, res) => {
  connection.query(`select * from gifts`, (err, result, fields) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(result);
  });
});
/**
 *
 * @param {int} SenderId  the user whos is been charge id
 * @param {int} ReciverId th user whom getting coins
 * @param {int} amount the amount of coins transfered
 * @returns Return 1 if trasaction succeeded and return 0 if it does not
 */
const MakeTransiction = (SenderId, ReciverId, amount) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `call MakeTransiction(?,?,?);`,
      [SenderId, ReciverId, amount],
      (err, results, fields) => {
        if (err) reject(err);
        console.log("res " + results[0][0].res);
        resolve(results[0][0].res);
      }
    );
  });
};
Router.get("/NumberCodes", (req, res) => {
  res.send(require("./countriesNumberCode.json"));
});
module.exports = Router;
