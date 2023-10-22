const express = require('express');
const userController = require('./../controllers/userController');
const authenticateUser = userController.authenticateUser;
const router = express.Router();

// Routes for user registration and authentication
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes that require authentication
router.get('/profile/:userId', authenticateUser, userController.getUserProfile);
router.put('/profile', authenticateUser, userController.updateUserProfile);
router.delete(
  '/deactivate',
  authenticateUser,
  userController.deactivateAccount
);
router.get(
  '/interactions',
  authenticateUser,
  userController.getUserInteractions
);
router.get(
  '/contributions',
  authenticateUser,
  userController.getUsersContributions
);

// Route to refresh the access token
router.post('/refresh-token', authenticateUser, userController.refreshToken);

// Route to search for users
router.get('/search', userController.searchUsers);

// Route to log out (invalidate the token or session)
router.post('/logout', authenticateUser, userController.logoutUser);

module.exports = router;
