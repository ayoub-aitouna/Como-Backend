const express = require("express");
let mysql = require("mysql");
const Router = express.Router();
const connection = require("../DB/Index");

Router.get("/UpdateUserToLive", (req, res) => {
  connection.query(
    `update user set user.IsStreaming = ? where idUser =?`,
    [req.query.IsStreaming == "true", req.query.UserId],
    (err, rows, field) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      if (req.query.IsStreaming != "true") DeleteAllComments(req.query.UserI);
      res.status(200).send(rows);
    }
  );
});
Router.get("/UpdateUserToOnline", (req, res) => {
  console.table([req.body.UserId]);
  connection.query(
    `update user set user.IsAvailable =true where idUser =?`,
    [req.body.UserId],
    (err, rows, field) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(rows);
    }
  );
  const timeout = setTimeout(() => {
    let Id = req.body.UserId;
    connection.query(
      `update user set user.IsAvailable =false where idUser =?`,
      [Id],
      (err, rows, field) => {}
    );
  }, 8 * 10 * 1000);
  timeout.Clrar;
});

const DeleteAllComments = (id) => {
  connection.query(
    `delete from livechatcomments where channelId =?`,
    [id],
    (err, results, field) => {
      if (err) return err;
    }
  );
};
module.exports = Router;
