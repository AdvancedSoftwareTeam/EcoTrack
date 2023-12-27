const DataRepository = require('../data/database/DataRepository');
const AlertRepository = require('../data/database/AlertRepository');
const dataRepository = new DataRepository();

exports.submitData = async (req, res) => {
  try {
    const message = await dataRepository.submitData(req, res);
    //AlertRepository.checkAlerts(req, res);
    console.log(message);
    res.status(201).json({ message });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.uploadData = (req, res) => {
  dataRepository.getData(req, res);
};
