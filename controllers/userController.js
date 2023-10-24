const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;

  userRepository
    .registerUser(username, email, password)
    .then((message) => {
      res.status(201).json({ message }); // Registration was successful, return the success message
    })
    .catch((error) => {
      res.status(400).json({ message: error }); // Registration encountered an error, return the error message
    });
};

exports.loginUser = (req, res) => {
  userRepository.loginUser(req, res);
};

exports.getUserProfile = (req, res) => {
  userRepository.getUserProfile(req, res);
};

exports.searchUser = (req, res) => {
  userRepository.searchUser(req, res);
};

exports.updateUserProfile = (req, res) => {
  userRepository.updateUserProfile(req, res);
};

exports.deactivateAccount = (req, res) => {
  userRepository.deactivateAccount(req, res);
};

exports.logoutUser = (req, res) => {
  userRepository.logoutUser(req, res);
};

exports.getUserInteractions = (req, res) => {
  userRepository.getUserInteractions(req, res);
};

exports.getUsersContributions = (req, res) => {
  userRepository.getUsersContributions(req, res);
};
