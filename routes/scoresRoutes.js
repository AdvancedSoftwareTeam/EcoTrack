// scoresRoutes.js

const express = require('express');
const router = express.Router();
const scoresController = require('../controllers/scoresController');

router.get('/:userId', scoresController.getUserScore);

module.exports = router;
