const AlertRepository = require('../data/database/AlertRepository');

const alertRepository = new AlertRepository();
const {
  addUserSocket,
  removeUserSocket,
  getUserSocket,
  doesUserExist,
  notifyUser,
} = require('../services/SocketService.js');

exports.addAlerts = (req, res) => {
  return alertRepository.createAlert(req, res);
};
exports.updateAlerts = (req, res) => {
  return alertRepository.updateAlert(req, res);
};
exports.deleteAlerts = (req, res) => {
   return alertRepository.deleteAlert(req, res);
 };
