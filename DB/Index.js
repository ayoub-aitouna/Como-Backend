var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "mysql-54645-0.cloudclusters.net",
  user: "admin",
  port: 17796,
  password: "mwjZW221",
  database: "appchat",
});
connection.connect(function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("Connected!");
});
module.exports = connection;
