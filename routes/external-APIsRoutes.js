const express = require('express');
const externalAPIsController = require('../controllers/external-APIsController');
const { authenticateUser } = require('../middlewares/authentication');

const router = express.Router();

router.get('/news/:topic', externalAPIsController.getNewsByTopic);
router.get('/news', authenticateUser, externalAPIsController.getNews);

module.exports = router;
