function generateSql(number, interval) {
  let sql = `SELECT DISTINCT
    ScanTimestamp, hd_scan.HdID, Flag, FlagValue
  FROM
    hd_scan
        INNER JOIN
    hd ON hd.HdID = hd_scan.HdID
        INNER JOIN
    \`order\` ON \`order\`.OrderID = hd.OrderID
        INNER JOIN
    vas_for_order ON \`order\`.OrderID = vas_for_order.OrderID
        INNER JOIN
    vas ON vas.VasID = vas_for_order.VasID
  WHERE
    \`order\`.OrderID IN (SELECT 
        OrderID
      FROM
          vas_productivity_database.vas_for_order
      INNER JOIN vas ON vas.VasID = vas_for_order.VasID
      GROUP BY OrderID
      HAVING COUNT(vas_for_order.VasID) = 1) 
  And ScanTimestamp > Now() - INTERVAL ${number} ${interval}`;
return sql;
}

function calculateAverages() {
}

module.exports.calculateAverages = calculateAverages;