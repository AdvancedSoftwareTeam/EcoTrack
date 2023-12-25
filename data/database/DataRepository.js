/* eslint-disable prefer-promise-reject-errors */

const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection({
  /* host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,*/

  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ECHOTRACK',
});

class DataRepository {
  submitData(req, res) {
    const { DataType, DataValue } = req.body;

    const userId = req.session.userId;
    if (!userId) {
      const unAuthError = 'User not authenticated.';
      console.error(unAuthError);
      return res.status(401).json({ message: unAuthError });
    }

    return new Promise((resolve, reject) => {
      const timestamp = new Date();
      db.query(
        'INSERT INTO data (DataType, DataValue, Timestamp, UserID, DataSource, Location, Description) VALUES (?, ?, ?, ?, ?, ?,?)',
        [DataType, DataValue, timestamp, userId, null, null, null],
        (error, results) => {
          if (error) {
            console.error('Error inserting into the database:', error);
            const err = `Error inserting into the database: ${error.message}`;
            return reject(err);
          }
          res.setHeader('Content-Type', 'application/json');
          return resolve('Data submitted successfully.');
        },
      );
    });
  }

  getData(req, res) {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    db.query(
      'SELECT DataType, DataValue, Timestamp FROM data WHERE userId = ?',
      [userId],
      (error, results) => {
        if (error) {
          console.error('Error querying data from the database:', error);
          const detailedError = `Error querying data from the database: ${error.message}`;
          return res.status(500).json({ message: detailedError });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'Data not found.' });
        }

        const Data = results[0];
        return res.json({ data: Data });
      },
    );
  }
}

module.exports = DataRepository;
