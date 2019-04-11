const express = require("express");
var mysql = require("mysql2");
var json2xls = require("json2xls");
var vasCalc = require("./vasCalculations");

const app = express();

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "admin2",
  database: "vas_productivity_database"
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
  let query = pool.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send("Updated!");
  });
});

app.get("/hdscan", (req, res) => {
  let sql = "SELECT * FROM hd_scan";
  let query = pool.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.get("/settings", (req, res) => {
  let sql = "SELECT * FROM vas";
  let query = pool.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);
  });
});

app.get("/hd", (req, res) => {
  let sql = "SELECT * FROM hd";
  let query = pool.query(sql, (err, results) => {
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
  let query = pool.query(sql, (err, results) => {
    if (err) throw err;
    scoreResults = results;
    res.json(results);
  });
});

app.get("/all/:from/:to", (req, res) => {
  let sql = `select distinct OrderName, HdNumber, Quantity, ScanTimestamp, Flag, FlagValue, PackStationName
from hd_scan 
inner join hd on hd.HdID = hd_scan.HdID
inner join \`order\` on \`order\`.OrderID = hd.OrderID
inner join vas_for_order on \`order\`.OrderID = vas_for_order.OrderID
inner join vas on vas.VasID = vas_for_order.VasID
inner join pack_station on pack_station.PackStationID = hd_scan.PackStationID
    where ScanTimestamp between '${req.params.from}' and '${req.params.to}'`;
  let query = pool.query(sql, (err, results) => {
    if (err) throw err;
    scoreResults = results;
    res.json(results);
  });
});

app.get("/avg/:number/:interval", (req, res) => {
  const sql = vasCalc;
  let query = pool.query(sql, (err, results) => {
    if (err) throw err;
    scoreResults = results;
    res.json(results);
  });
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
