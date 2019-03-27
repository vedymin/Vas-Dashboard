const express = require("express");
var mysql = require("mysql2");
var json2xls = require("json2xls");

const app = express();
const db = mysql.createConnection({
  // host: "10.55.137.48",
  host: "127.0.0.1",
  user: "root",
  password: "admin",
  database: "vas_productivity_database"
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected...");
});

let scoreResults = {};

app.use(json2xls.middleware);

app.get("/export", function(req, res) {
  res.xls("data.xlsx", scoreResults);
});

app.put("/settings/:id/:wage", (req, res) => {
  let sql = `UPDATE vas_productivity_database.vas SET Wage = ${
    req.params.wage
  } WHERE (VasID = ${req.params.id});`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send("Updated!");
  });
});

app.get("/hdscan", (req, res) => {
  let sql = "SELECT * FROM hd_scan";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.get("/settings", (req, res) => {
  let sql = "SELECT * FROM vas";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.get("/hd", (req, res) => {
  let sql = "SELECT * FROM hd";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.get("/score/:from/:to", (req, res) => {
  let sql = `select PackStationName, sum(Quantity*Wage) as Score, sum(Quantity) as Quantity, sum(Wage) as Difficulty from (
    select PackStationName, HdNumber, Quantity, OrderName, sum(Wage) as Wage from hd_scan 
    inner join hd on hd.HdID = hd_scan.HdID
    inner join \`order\` on \`order\`.OrderID = hd.OrderID
    inner join vas_for_order on \`order\`.OrderID = vas_for_order.OrderID
    inner join vas on vas.VasID = vas_for_order.VasID
    inner join pack_station on pack_station.PackStationID = hd_scan.PackStationID
    where ScanTimestamp between '${req.params.from}' and '${req.params.to}'
    group by PackStationName, HdNumber, Quantity, OrderName ) as x
    GROUP BY PackStationName`;
  console.log(sql);
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    scoreResults = results;
    res.json(results);
  });
});

// var jsonArr = [
//   {
//     foo: "bar",
//     qux: "moo",
//     poo: 123,
//     stux: new Date()
//   },
//   {
//     foo: "bar",
//     qux: "moo",
//     poo: 345,
//     stux: new Date()
//   }
// ];

// app.use(json2xls.middleware);

// app.get("/", function(req, res) {
//   res.xls("data.xlsx", jsonArr);
// });

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
