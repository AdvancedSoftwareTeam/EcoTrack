const UserRepository = require('../data/database/UserRepository');

exports.authenticateResearcher = (req, res, next) => {
  const userId = req.session.userId;
  if (userId && UserRepository.getUserType(userId) === 'researcher') {
    next();
  } else {
    // User is not logged in, deny access
    res
      .status(401)
      .json({ message: 'Unauthorized, You are not a researcher!' });
  }
};
