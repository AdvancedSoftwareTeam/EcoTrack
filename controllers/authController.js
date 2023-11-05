const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const { sequelize } = require('../models/Sequelize');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = {
    Username: req.body.username,
    Email: req.body.email,
    Password: req.body.password,
  };

  bcrypt.hash(newUser.Password, 10, (hashError, hashedPassword) => {
    if (hashError) {
      console.error('Error hashing the password:', hashError);
      return res.status(500).json({
        status: 'error',
        message: 'Error hashing the password',
      });
    }

    newUser.Password = hashedPassword;
    const date = new Date();

    sequelize
      .query(
        'INSERT INTO User (Username, Email, Password, ProfilePicture, Location, Interests, SustainabilityScore, RegistrationDate, LastLoginDate, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        {
          replacements: [
            newUser.Username,
            newUser.Email,
            newUser.Password,
            null,
            null,
            null,
            null,
            date,
            null,
            '1',
          ],
          type: sequelize.QueryTypes.INSERT,
        },
      )
      .then(() => {
        res.status(201).json({
          status: 'success',
          data: {
            user: newUser,
          },
        });
      })
      .catch((insertError) => {
        console.error('Error inserting into the database:', insertError);
        res.status(500).json({
          status: 'error',
          message: 'Error inserting into the database',
        });
      });
  });
});
