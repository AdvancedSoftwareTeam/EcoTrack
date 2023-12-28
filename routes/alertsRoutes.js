const express = require('express');
const alertsController = require('../controllers/alertsController');
const { authenticateUser } = require('../middlewares/authenticateUser');
const router = express.Router();

router.post('/addAlert', authenticateUser, alertsController.addAlerts);
router.put('/updateAlert', authenticateUser, alertsController.updateAlerts);
router.delete('/deleteAlert', authenticateUser, alertsController.deleteAlerts);
module.exports = router;
