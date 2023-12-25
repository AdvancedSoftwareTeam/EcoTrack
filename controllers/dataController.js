const DataRepository = require('../data/database/DataRepository');
//const { validationResult, body } = require('express-validator');
const dataRepository = new DataRepository();

exports.submitData = async (req, res) => {
  dataRepository
    .submitData(req, res)
    .then((message) => {
      res.status(201).json({ message });
      alertsRepo.checkAlerts(req,res);
    })
    .catch((error) => {
      res.status(400).json({ message: error });
    });
};

exports.uploadData = (req, res) => {
  dataRepository.getData(req, res);
};
