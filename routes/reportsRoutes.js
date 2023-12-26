const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

router.post('/reports', ReportController.createReport);
router.get('/reports', ReportController.getAllReports);
router.delete('/reports/:reportID', ReportController.deleteReport);

module.exports = router;
