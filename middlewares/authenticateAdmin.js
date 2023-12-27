const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.authenticateAdmin = (req, res, next) => {
  const userId = req.session.userId;
  if (userId && userRepository.getUserType(userId) === 'admin') {
    next();
  } else {
    // User is not logged in, deny access
    res.status(401).json({ message: 'Unauthorized, You are not an admin!' });
  }
};
