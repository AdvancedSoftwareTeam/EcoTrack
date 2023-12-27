const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { authenticateUser } = require('../middlewares/authenticateUser');

router.post('/reports', authenticateUser, ReportController.createReport);
router.get('/reports', authenticateUser, ReportController.getAllReports);
router.delete(
  '/reports/:reportID',
  authenticateUser,
  ReportController.deleteReport,
);

module.exports = router;
