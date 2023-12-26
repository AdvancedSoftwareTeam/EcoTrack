const express = require('express');
const alertController = require('../controllers/alertsController');
const router = express.Router();

router.post('/addAlert', alertController.addAlerts);
router.put('/updateAlert', alertController.updateAlerts);
router.delete('/deleteAlert', alertController.deleteAlerts);
module.exports = router;
