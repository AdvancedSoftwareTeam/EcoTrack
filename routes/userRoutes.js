const express = require('express');
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authentication');

const router = express.Router();

// Routes for user registration and authentication
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes that require authentication
router
  .route('/profile')
  .get(authenticateUser, userController.getUserProfile)
  .put(authenticateUser, userController.updateUserProfile);

router.get('/profile/:userId', userController.getOthersProfile);

router.delete(
  '/deactivate',
  authenticateUser,
  userController.deactivateAccount,
);
router.get('/interactions', userController.getUserInteractions);
router.get('/contributions', userController.getUsersContributions);
// Route to refresh the access token
router.post('/refresh-token', userController.refreshToken);

// Route to search for users
router.get('/search', userController.searchUsers);

// // Route to log out (invalidate the token or session)
router.post('/logout', userController.logoutUser);

module.exports = router;
