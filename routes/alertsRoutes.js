const express = require('express');
const alertController = require('../controllers/alertsController');
const router = express.Router();

router.post('/addAlert', alertController.addAlerts);


module.exports = router;