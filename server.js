const express = require("express");
var mysql = require("mysql2");

const app = express();
const db = mysql.createConnection({
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

app.get("/hdscan", (req, res) => {
  let sql = "SELECT * FROM hd_scan";
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

app.get("/score", (req, res) => {
  let sql = `select PackStationName, sum(Quantity*Wage) as Score, sum(Quantity) as Quantity, sum(Wage) as Difficulty from (
    select PackStationName, HdNumber, Quantity, OrderName, sum(Wage) as Wage from hd_scan 
    inner join hd on hd.HdID = hd_scan.HdID
    inner join \`order\` on \`order\`.OrderID = hd.OrderID
    inner join vas_for_order on \`order\`.OrderID = vas_for_order.OrderID
    inner join vas on vas.VasID = vas_for_order.VasID
    inner join pack_station on pack_station.PackStationID = hd_scan.PackStationID
    where ScanTimestamp between '2019-03-25 13:00:00' and '2019-03-25 13:59:00'
    group by PackStationName, HdNumber, Quantity, OrderName ) as x
    GROUP BY PackStationName`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
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
