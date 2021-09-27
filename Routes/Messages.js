const express = require("express");
let mysql = require("mysql");
const Router = express.Router();
const connection = require("../DB/Index.js");
const path = require("path");
const Config = require("../Config/Config");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const multer = require("multer");
const upload = multer({ dest: "public/Uploads" });
const BaseUrl = Config.BaseUrl;
const { uploadFile } = require("../s3");

const getRoomInfo = (id) => {
  return new Promise((resolve, rejects) => {
    connection.query(
      `select name,profileImage ,isAvailable from user where idUser =?`,
      [id],
      (err, rows, field) => {
        if (err) return res.status(500).send(err);
        resolve(rows[0]);
      }
    );
  });
};

const LoopAllRoms = async (Roms, id) => {
  let Roms_info = [];
  for (let Rom of Roms) {
    let item;
    if (Rom.user_id == id) {
      item = await getRoomInfo(Rom.receiverId);
    } else {
      item = await getRoomInfo(Rom.user_id);
    }
    Roms_info.push({
      receiverId: Rom.receiverId,
      SenderId: Rom.user_id,
      lastMessage: Rom.lastMessage,
      seen: Rom.seen,
      unseenNumber: Rom.unseenNumber,
      Hash: Rom.Hash,
      name: item.name,
      profileImage: item.profileImage,
      isAvailable: item.isAvailable,
    });
  }
  return Roms_info;
};
Router.get("/ChatRoms", async (req, res) => {
  connection.query(
    `select * from inbox where user_id =${mysql.escape(
      req.query.id
    )} or receiverId =${mysql.escape(req.query.id)};`,
    async (err, rows, field) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      const data = await LoopAllRoms(rows, req.query.id);
      res.send(data);
    }
  );
});
Router.get("/Chat", (req, res) => {
  const Hash_id = req.query.Hash_id;
  const SenderId = req.query.SenderId;
  const receiverId = req.query.receiverId;
  console.table([Hash_id, SenderId, receiverId]);
  console.table([Hash_id, SenderId, receiverId]);
  if (Hash_id == null || Hash_id == "undefined" || Hash_id == "") {
    connection.query(
      `select message.id , DATE_FORMAT(message.sendTime, '%H:%i') as sendTime , DATE_FORMAT(message.readTime, '%H:%i') as readTime 
      ,message.contentImage,message.contentText,message.contentAudio,message.giftCoins,message.SenderId,message.Delete_id,message.Hash_id ,message.CallsDuration
       from message inner join inbox on message.Hash_id=inbox.Hash
        where (user_id =? or receiverId =?) and (user_id =? or receiverId =?)`,
      [SenderId, SenderId, receiverId, receiverId],
      async (err, rows, field) => {
        if (err) return res.status(500).send(err);
        console.log(rows);
        res.send(rows);
      }
    );
  } else {
    connection.query(
      `select
    id ,DATE_FORMAT(sendTime, '%H:%i') as sendTime , DATE_FORMAT(readTime, '%H:%i') as readTime ,
    contentImage,contentText,contentAudio,giftCoins,SenderId,Delete_id,Hash_id,message.CallsDuration 
    from message where Hash_id=?;`,
      [Hash_id],
      async (err, rows, field) => {
        if (err) return res.status(500).send(err);
        console.log(rows);
        res.send(rows);
      }
    );
  }
});
Router.get("/Read", (req, res) => {
  connection.query(
    `update inbox set unseenNumber= 0 ,seen=true where Hash =
  ${mysql.escape(req.query.Hash_id)};`,
    async (err, rows, field) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
});

Router.post("/Send", (req, res) => {
  console.log(req.body);
  connection.query(
    `call SendMesage(?,?,?,?,?,?,?,?);`,
    [
      req.body.contentImage,
      req.body.contentText,
      req.body.contentAudio,
      req.body.giftCoins,
      req.body.SenderId,
      req.body.receiverId,
      req.body.Hash_id == null || req.body.Hash_id == "undefined"
        ? ""
        : req.body.Hash_id,
      req.body.CallsDuration == null || req.body.CallsDuration == "undefined"
        ? 0
        : req.body.CallsDuration,
    ],
    (err, Rows, field) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.status(200).send(Rows);
    }
  );
});

Router.post("/UploadImages", async (req, res) => {
  let File;
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("err no file");
    return res.sendStatus(403);
  }
  File = req.files.fileName;
  const result = await uploadFile(File);
  let url = `${BaseUrl}uploads/${result.key}`;
  res.send({ contentImage: url });
});

module.exports = Router;
