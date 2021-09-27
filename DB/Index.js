var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "mysql-48654-0.cloudclusters.net",
  user: "admin",
  port: 19757,
  password: "xsLNEzmO",
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
