const express = require('express');
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authentication');
const authController = require('../controllers/authController');

const router = express.Router();

// Routes for user registration and authentication
router.post('/signup', authController.signup);
router.post('/login', userController.loginUser);

// Protected routes that require authentication
router
  .route('/profile')
  .get(authenticateUser, userController.getUserProfile)
  .put(authenticateUser, userController.updateUserProfile);

router.delete(
  '/deactivate',
  authenticateUser,
  userController.deactivateAccount,
);

router.get('/sameUsers', authenticateUser, userController.getSameUsers);
router.post(
  '/contribution',
  authenticateUser,
  userController.createContribution,
);
router.get('/contributions', userController.getUsersContributions);

router.get(
  '/receivedMessages',
  authenticateUser,
  userController.getReceivedMessages,
);
router.get('/sentMessages', authenticateUser, userController.getSentMessages);
router.post('/sendMessage', authenticateUser, userController.se);
// Route to search for users
router.get('/search/:username', authenticateUser, userController.searchUser);

// // Route to log out (invalidate the token or session)
router.post('/logout', userController.logoutUser);

module.exports = router;
