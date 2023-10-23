const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const userController = require('../controllers/userController');

// eslint-disable-next-line prefer-destructuring
//const authenticateUser = userController.authenticateUser;
const router = express.Router();

passport.use(
  new LocalStrategy((username, password, done) => {
    // Add your custom authentication logic here
    if (username === 'user' && password === 'password') {
      return done(null, { username: 'user' });
    }
    return done(null, false, { message: 'Incorrect username or password' });
  }),
);

// Routes for user registration and authentication
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes that require authentication
router.get('/profile/:userId', userController.getUserProfile);

// router.put('/profile', authenticateUser, userController.updateUserProfile);
// router.delete(
//   '/deactivate',
//   authenticateUser,
//   userController.deactivateAccount,
// );
// router.get(
//   '/interactions',
//   authenticateUser,
//   userController.getUserInteractions,
// );
// router.get(
//   '/contributions',
//   authenticateUser,
//   userController.getUsersContributions,
// );
// // Route to refresh the access token
// router.post('/refresh-token', authenticateUser, userController.refreshToken);

// // Route to search for users
// router.get('/search', userController.searchUsers);

// // Route to log out (invalidate the token or session)
router.post('/logout', userController.logoutUser);

router.use(passport.initialize());

module.exports = router;
