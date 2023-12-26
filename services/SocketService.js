const userSocketMap = {};

exports.addUserSocket = (userId, socket) => {
  userSocketMap[userId] = socket;
};

exports.removeUserSocket = (socket) => {
  const userId = Object.keys(userSocketMap).find(
    (key) => userSocketMap[key] === socket,
  );
  if (userId) {
    delete userSocketMap[userId];
  }
};
exports.doesUserExist = (userId) => {
  return userSocketMap.hasOwnProperty(userId);
};
exports.getUserSocket = (userId) => userSocketMap[userId];
exports.notifyUser = (userId, data) => {
  if (doesUserExist(userId)) {
    userSocketMap[userId].emit('Notification', data);
  }
};
