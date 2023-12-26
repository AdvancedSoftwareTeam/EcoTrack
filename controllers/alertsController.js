const AlertRepository = require('../data/database/AlertRepository');

const alertRepository = new AlertRepository();
exports.addAlerts = (req, res) => {
   return  alertRepository
      .createAlert(req, res)
      
  };