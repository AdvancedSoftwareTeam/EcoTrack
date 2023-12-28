const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});

const ReportModel = {
  createReport: (userID, reportType, description, status) => {
    const submitDate = new Date();
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO reports (userID, reportType, description, submitDate, status) VALUES (?, ?, ?, ?, ?)';
      db.query(
        query,
        [userID, reportType, description, submitDate, status],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId);
          }
        },
      );
    });
  },

  getAllReports: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM reports';
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  deleteReport: (reportID) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM reports WHERE reportID = ?';
      db.query(query, [reportID], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
      });
    });
  },
};

module.exports = ReportModel;
