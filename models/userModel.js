const { DataTypes } = require('sequelize');

const { sequelize } = require('./Sequelize');

const User = sequelize.define('User', {
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ProfilePicure: DataTypes.STRING,
  location: DataTypes.STRING,
  Interests: {
    type: DataTypes.JSON,
  },
  SustainabilityScore: DataTypes.DECIMAL,
  RegistrationDate: DataTypes.DATE,
  LastLoginDate: DataTypes.DATE,
  active: DataTypes.TINYINT,
});

module.exports = User;
