const mysql = require('mysql2');
const { notifyUser } = require('../../services/SocketService');
let alertsMap = {};
let allAlerts = [];
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});
class AlertRepository {
  async getAllAlerts() {
    db.query('SELECT * FROM alalerts', (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Internal server error.' });
      }
      for (let i of results) {
        if (!alertsMap.hasOwnProperty(i['UserID'])) {
          alertsMap[i['UserID']] = [];
        }
        let alertss = alertsMap[i['UserID']];
        alertss.push(i);
        alertsMap[i['UserID']] = alertss;
      }
      allAlerts = results;
    });
  }
  checkAlerts(req, res) {
    const { DataType, DataValue } = req.body;
    for (let i of allAlerts) {
      if (i['AlertType'] === DataType) {
        if (i['AlertThresholds'] <= DataValue) {
          notifyUser(
            i['UserID'],
            `${DataType} has exceeded the limit ${i['AlertThresholds']},\n and the Value now is ${DataValue}`,
          );
        }
      }
    }
  }
  createAlert(req, res) {
    const { AlertThresholds, AlertType, AlertName, UserID } = req.body;
    db.query(
      'INSERT INTO alalerts (UserID, AlertName, AlertType, AlertThresholds) VALUES (?, ?, ?, ?)',
      [UserID, AlertName, AlertType, AlertThresholds],
      (insertError) => {
        if (insertError) {
          console.log(insertError);
        }
      },
    );
    this.getAllAlerts();
    return res.status(200).json('added');
  }
}
module.exports = AlertRepository;
