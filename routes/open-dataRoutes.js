const express = require('express');
const router = express.Router();
const openDataController = require('../controllers/open-dataController');

// for search
router.get('/search', openDataController.searchOpenData);
router.get('/search/:id', openDataController.searchOpenDataByCriteria);

// for analysis retrive
router.get('/analysis', openDataController.performAnalysis);
router.get('/analysis/:id', openDataController.performAnalysis);
//for analysis submit
router.post('/submit-analysis', openDataController.submitAnalysis);
// for analysis update
router.put('/update-analysis', openDataController.updateAnalysis);

module.exports = router;
