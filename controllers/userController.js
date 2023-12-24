const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.registerUser = (req, res) => {
  userRepository
    .registerUser(req, res)
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

exports.getSameUsers = (req, res) => {
  userRepository.getSameUsers(req, res);
};

exports.getReceivedMessages = (req, res) => {
  userRepository.getReceivedMessages(req, res);
};

exports.getSentMessages = (req, res) => {
  userRepository.getSentMessages(req, res);
};

exports.sendMessage = (req, res) => {
  userRepository.sendMessage(req, res);
};

exports.getUsersContributions = (req, res) => {
  userRepository.getUsersContributions(req, res);
};

exports.createContribution = (req, res) => {
  userRepository.createContribution(req, res);
};
