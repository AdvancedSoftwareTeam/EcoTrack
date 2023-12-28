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
  database: 'ecotrack',
});

class ScoreRepository {
  oldVal = 0;
  userExists(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT 1 FROM scores WHERE UserID = ? LIMIT 1',
        [userId],
        (error, results) => {
          if (error) {
            console.error('Error checking if user exists:', error);
            reject(error);
          } else {
            const exists = results.length > 0;
            resolve(exists);
          }
        },
      );
    });
  }

  updateOrInsertScore(userId, DataValue, DataType) {
    const timestamp = new Date();
    let val;
    let newVal;
    if (DataType == ' ') {
      val = DataValue * 1.2;
    }
    switch (DataType) {
      case 'Air Quality':
        val = DataValue * 0.2;
        break;
      case 'Temperature':
        val = DataValue * 0.1;
        break;
      case 'Humidity':
        val = DataValue * 0.1;
        break;
      case 'WaterQuality':
        val = DataValue * 0.2;
        break;
      case 'BiodiversityMetrics':
        val = DataValue * 0.2;
        break;
    }

    newVal = this.oldVal + val;
    this.oldVal = newVal;

    const description = `Score increased by ${val}`;

    return this.userExists(userId).then((exists) => {
      return new Promise((resolve, reject) => {
        if (exists) {
          db.query(
            'UPDATE scores SET ScoreValue = ?, Timestamp = ?, ScoreDescription = ? WHERE UserID = ?',
            [newVal, timestamp, description, userId],
            (updateError, updateResults) => {
              if (updateError) {
                console.error(
                  'Error updating score in the database:',
                  updateError,
                );
                reject(updateError);
              } else {
                console.log('Score updated successfully.');
                resolve('Score updated successfully.');
              }
            },
          );
        } else {
          db.query(
            'INSERT INTO scores (UserID, ScoreValue, Timestamp, ScoreDescription) VALUES (?, ?, ?, ?)',
            [userId, newVal, timestamp, description],
            (insertError, insertResults) => {
              if (insertError) {
                console.error(
                  'Error inserting new score in the database:',
                  insertError,
                );
                reject(insertError);
              } else {
                console.log('New score created successfully.');
                resolve('New score created successfully.');
              }
            },
          );
        }
      });
    });
  }

  scoreOfUser(req, res) {
    const userId = req.session.userId;

    db.query(
      'SELECT * from scores WHERE userId = ?',
      [userId],
      (error, results) => {
        if (error) {
          console.error('Error querying data from the database:', error);
          const detailedError = `Error querying data from the database: ${error.message}`;
          return res.status(500).json({ message: detailedError });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: 'Submit data to start your score!' });
        }

        const score = results;
        //  const description = 'your scored is increased \n';
        return res.status(200).json({ Score: score });
      },
    );
  }
}

module.exports = ScoreRepository;
