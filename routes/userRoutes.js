const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

// Protected route that requires authentication
router.get('/protected', userController.authenticateUser(), (req, res) => {
  // This route is only accessible to authenticated users
  res.json({ message: 'Access granted!' });
});

//router.route('/').get()

module.exports = router;
