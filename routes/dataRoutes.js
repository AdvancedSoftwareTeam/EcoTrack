const express = require('express');
const dataController = require('../controllers/dataController');
const router = express.Router();

router.post('/submit', dataController.submitData);
router.get('/get', dataController.uploadData);

module.exports = router;
