const mysql = require(mysql2);

const db = mysql.createconnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Apr!242019',
    database: 'employee_db',
  },
);

module.exports = db;