const e = require("cors");
const express = require("express");
var mysql = require("mysql");

const Router = express.Router();
const connection = require("../DB/Index");

Router.post("/Singin", async (req, res) => {
  try {
    res.send(await SingIn(req.body));
  } catch (err) {
    res.sendStatus(400);
  }
});

Router.post("/SingUp", async (req, res) => {
  try {
    res.send(String(await SingUp(req.body)));
  } catch (err) {
    res.sendStatus(400);
  }
});
Router.post("/GoogleAuth", async (req, res) => {
  const isExists = await CheckIfExists(req.body.email);
  if (!isExists) {
    try {
      res.send(await SingUp(req.body));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    try {
      res.send(await SingIn(req.body));
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }
});
const CheckIfExists = (email) => {
  return new Promise((res, rej) => {
    connection.query(
      `select * from user where email = ? `,
      [email],
      (err, result, fields) => {
        if (err) rej(err);
        res(result.length > 0);
      }
    );
  });
};

const SingUp = (body) => {
  console.log(body.name);
  return new Promise((res, rej) => {
    connection.query(
      `SELECT InsertUser(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) As "ID"`,
      [
        fromnulltoEmpty(body.name),
        fromnulltoEmpty(body.phoneNumber),
        fromnulltoEmpty(body.gender),
        fromnulltoEmpty(body.country),
        fromnulltoEmpty(body.about),
        fromnulltoEmpty(body.job),
        fromnulltoEmpty(body.age),
        fromnulltoEmpty(body.education),
        fromnulltoEmpty(body.profileImage),
        false,
        false,
        false,
        false,
        0,
        fromnulltoEmpty(body.password),
        fromnulltoEmpty(body.email),
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          rej(err);
        } else {
          const idUser = result[0].ID;
          res(String(idUser));
        }
      }
    );
  });
};
const SingIn = (body) => {
  return new Promise((res, rej) => {
    let sqlQuery;
    if (
      body.email === "" ||
      body.email === null ||
      body.email === "undefined"
    ) {
      sqlQuery =
        "select * from user where phoneNumber = " +
        mysql.escape(body.phoneNumber) +
        "And password =" +
        mysql.escape(body.password);
    } else {
      sqlQuery =
        "select * from user where email = " +
        mysql.escape(body.email) +
        "And password = " +
        mysql.escape(body.password);
    }

    connection.query(sqlQuery, (err, rows, fields) => {
      if (err) {
        rej(404);
      } else {
        const user = rows[0];
        console.log(rows);
        if (typeof user !== "undefined") {
          res(String(user.idUser));
        } else {
          rej(403);
        }
      }
    });
  });
};
const fromnulltoEmpty = (inPutValue) => {
  console.log("Inpute " + inPutValue);
  if (inPutValue == null || inPutValue == "undefined") {
    return "";
  }
  return inPutValue;
};

module.exports = Router;
