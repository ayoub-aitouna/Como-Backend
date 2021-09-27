const connection = require("./Db/Index");
let mysql = require("mysql");

function Socket(io) {
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("Connect", (hashId) => {
      socket.join(hashId);
      console.log("aaa" + hashId);
    });
    socket.on("Send", (hashId) => {
      console.log("aaa" + hashId);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}
console.log("aaa");

const saveMessagetoDb = (Content) => {
  connection.query(
    `call SendMesage(?,?,?,?,?,?,?);`,
    [
      req.body.contentImage,
      req.body.contentText,
      req.body.contentAudio,
      req.body.giftCoins,
      req.body.SenderId,
      req.body.receiverId,
      req.body.Hash_id,
    ],
    (err, Rows, field) => {
      if (err) {
        return console.log(err);
      }
      return console.log(Rows);
    }
  );
};
module.exports = Socket;

socket.on("CallResponse", (c) => {
  console.table(["Responce", c]);
  const channel = `${c.userId}-channelcall-${c.receiverId}`;
  socket
    .to(c.userId)
    .to(c.receiverId)
    .emit("CallResponse", {
      Token: Token(channel, RtcRole.PUBLISHER),
      channel: channel,
      userId: c.userId,
      receiverId: c.receiverId,
      Answer: c.Answer,
    });
});
