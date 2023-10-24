exports.authenticateUser = (req, res, next) => {
  if (req.session.userId) {
    // User is logged in, allow access
    next();
  } else {
    // User is not logged in, deny access
    res.status(401).json({ message: 'Unauthorized' });
  }
};
