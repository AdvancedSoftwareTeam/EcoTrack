const express = require('express');
const router = express.Router();
const openDataController = require('../controllers/open-dataController');

// for search
router.get('/search', openDataController.searchOpenData);
router.get('/search/:DataType', openDataController.searchOpenDataByDataType);

// for analysis retrive
router.get('/analysis', openDataController.performAnalysis);
router.get('/analysis/:DataType', openDataController.performAnalysisbyDataType);
//for analysis submit
router.post('/submit-analysis', openDataController.submitAnalysis);

module.exports = router;
