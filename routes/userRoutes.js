const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Routes for user registration and authentication
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes that require authentication
router.get('/profile/:userId', userController.getUserProfile);
router.put('/profile/:userId', userController.updateUserProfile);
router.delete('/deactivate', userController.deactivateAccount);
router.get('/interactions', userController.getUserInteractions);
router.get('/contributions', userController.getUsersContributions);
// Route to refresh the access token
router.post('/refresh-token', userController.refreshToken);

// Route to search for users
router.get('/search', userController.searchUsers);

// // Route to log out (invalidate the token or session)
router.post('/logout', userController.logoutUser);

module.exports = router;
