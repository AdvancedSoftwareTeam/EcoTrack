/* eslint-disable prefer-promise-reject-errors */
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});

class UserRepository {
  registerUser(req, res) {
    const { username, email, password } = req.body;

    return new Promise((resolve, reject) => {
      // Check if the user already exists (Checking the email)
      db.query(
        'SELECT * FROM User WHERE email = ? OR username = ? AND active = 1',
        [email, username],
        (error, results) => {
          if (error) {
            return reject('Internal server error.');
          }

          if (results.length > 0) {
            return reject('Email or username already in use.');
          }

          // Hash the password before storing it
          bcrypt.hash(password, 10, (hashError, hashedPassword) => {
            if (hashError) {
              return reject('User registration failed.');
            }

            const registrationDate = new Date(); // Get the current date and time

            // Create a new user with the hashed password and registration date
            db.query(
              'INSERT INTO User (username, email, password, registrationDate) VALUES (?, ?, ?, ?)',
              [username, email, hashedPassword, registrationDate],
              (insertError) => {
                if (insertError) {
                  console.log(password);

                  return reject('User registration failed.');
                }

                return resolve('User registered successfully.');
              },
            );
          });
        },
      );
    });
  }

  getUserProfile(req, res) {
    const { userId } = req.session;

    db.query(
      'SELECT username, email, profilePicture, location, interests, sustainabilityScore, registrationDate, lastLoginDate FROM User WHERE userID = ? AND active = 1',
      [userId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found.' });
        }

        const userProfile = results[0];
        return res.json({ user: userProfile });
      },
    );
  }

  searchUser(req, res) {
    const { username } = req.params;

    // Find the user by username
    db.query(
      'SELECT Username, Interests, location, ProfilePicture, SustainabilityScore FROM User WHERE username = ? AND active = 1',
      [username],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.' });
        }

        return res.json({ User: results[0] });
      },
    );
  }

  loginUser(req, res) {
    if (req.session.userId) {
      return res.status(500).json({ message: 'User is already logged in.' });
    }
    const { email, password } = req.body;

    // Find the user by email
    db.query(
      'SELECT * FROM User WHERE email = ? AND active = 1',
      [email],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.' });
        }

        const user = results[0];

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(
          password,
          user.Password,
          (compareError, passwordMatch) => {
            if (compareError) {
              return res
                .status(500)
                .json({ message: 'Internal server error.' });
            }
            if (!passwordMatch) {
              return res.status(401).json({ message: 'Invalid data.' });
            }

            req.session.userId = user.UserID; // Store the user's ID in the session

            // Update lastLoginDate in the database
            db.query(
              'UPDATE User SET lastLoginDate = CURRENT_TIMESTAMP WHERE userID = ?',
              [user.UserID],
              (updateError) => {
                if (updateError) {
                  return res
                    .status(500)
                    .json({ message: 'Internal server error.' });
                }

                return res.json({ message: 'Login successful.' });
              },
            );
          },
        );
      },
    );
  }

  updateUserProfile(req, res) {
    const { userId } = req.session;
    const { username, email, location, profilePicture, interests } =
      req.body.user;

    // Check if the user exists
    db.query(
      'SELECT * FROM User WHERE userID = ? AND active = 1',
      [userId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found.' });
        }

        // Prepare an update query based on the fields the user wants to update
        const updateFields = [];
        const updateValues = [];

        if (username) {
          updateFields.push('username = ?');
          updateValues.push(username);
        }
        if (email) {
          updateFields.push('email = ?');
          updateValues.push(email);
        }

        if (location) {
          updateFields.push('location = ?');
          updateValues.push(location);
        }

        // Handle interests (assuming interests is a JSON data type)
        if (interests) {
          // Use the JSON function JSON_SET to update JSON values
          updateFields.push('interests = JSON_SET(interests, "$.key", ?)');
          updateValues.push(interests.key);
        }

        if (profilePicture) {
          updateFields.push('profilePicture = ?');
          updateValues.push(profilePicture);
        }

        if (updateFields.length === 0) {
          return res
            .status(400)
            .json({ message: 'No valid fields to update.' });
        }

        // Construct the parameterized update query
        const updateQuery = `
      UPDATE User
      SET ${updateFields.join(', ')}
      WHERE userID = ? AND active = 1;
    `;

        // Combine the values for the query
        const queryValues = [...updateValues, userId];

        // Execute the parameterized query
        db.query(updateQuery, queryValues, (updateError) => {
          if (updateError) {
            return res.status(500).json({ message: 'Profile update failed.' });
          }

          return res.json({ message: 'Profile updated successfully.' });
        });
      },
    );
  }

  deactivateAccount(req, res) {
    const { userId } = req.session;

    // Check if the user exists
    db.query(
      'SELECT * FROM User WHERE userID = ?',
      [userId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found.' });
        }

        // Update the user's account to be deactivated
        db.query(
          'UPDATE User SET active = 0 WHERE userID = ?',
          [userId],
          (updateError) => {
            if (updateError) {
              return res
                .status(500)
                .json({ message: 'Account deactivation failed.' });
            }

            // Destroy the session after deactivating the account
            req.session.destroy((destroyError) => {
              if (destroyError) {
                return res
                  .status(500)
                  .json({ message: 'Error destroying session.' });
              }

              return res.json({ message: 'Account deactivated successfully.' });
            });
          },
        );
      },
    );
  }

  logoutUser(req, res) {
    const { userId } = req.session;

    // Check if the user is active before destroying the session
    db.query(
      'SELECT * FROM User WHERE userID = ? AND active = 1',
      [userId],
      (searchError, results) => {
        if (searchError) {
          res.status(500).json({ message: 'Error logging out.' });
        } else if (results.length === 0) {
          res.status(500).json({ message: 'Error logging out.' });
        } else {
          // User is active, destroy the session
          req.session.destroy((err) => {
            if (err) {
              res.status(500).json({ message: 'Error logging out.' });
            } else {
              res.json({ message: 'Logged out successfully.' });
            }
          });
        }
      },
    );
  }

  getUserInteractions(req, res) {
    const { userId } = req.params;

    // Query the database to retrieve user interactions
    db.query(
      'SELECT * FROM Data WHERE userId = ?',
      [userId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }

        return res.json({ interactions: results });
      },
    );
  }

  getUsersContributions(req, res) {
    const { userId } = req.params;

    // Query the database to count the user's data submissions
    db.query(
      'SELECT COUNT(*) AS submissionCount FROM Data WHERE userId = ?',
      [userId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found.' });
        }

        const { submissionCount } = results[0];

        // Calculate contributions based on data submissions
        const contributions = submissionCount * 10; // Example calculation

        return res.json({ contributions });
      },
    );
  }
}

module.exports = UserRepository;
