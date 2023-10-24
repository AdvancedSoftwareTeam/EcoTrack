const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});

// Function to generate a JSON Web Token (JWT)
// Generate a strong, random secret key
const generateSecretKey = () => {
  const keyLength = 32; // 32 bytes (256 bits) key length
  return crypto.randomBytes(keyLength).toString('hex');
};
// ---------------------------------------

exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user is already exists (Checking the email)
  db.query(
    'SELECT * FROM User WHERE ( email = ? OR username = ? ) AND active = 1',
    [email, username],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Internal server error.' });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: 'Email or username already in use.' });
      }

      // Hash the password before storing it
      bcrypt.hash(password, 10, (hashError, hashedPassword) => {
        if (hashError) {
          return res.status(500).json({ message: 'User registration failed.' });
        }

        const registrationDate = new Date(); // Get the current date and time

        // Create new user with the hashed password and registration date
        db.query(
          'INSERT INTO User (username, email, password, registrationDate) VALUES (?, ?, ?, ?)',
          [username, email, hashedPassword, registrationDate],
          (insertError) => {
            if (insertError) {
              return res
                .status(500)
                .json({ message: 'User registration failed.' });
            }

            return res
              .status(201)
              .json({ message: 'User registered successfully.' });
          },
        );
      });
    },
  );
};

exports.loginUser = (req, res) => {
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
      bcrypt.compare(password, user.Password, (compareError, passwordMatch) => {
        if (compareError) {
          return res.status(500).json({ message: 'Internal server error.' });
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
      });
    },
  );
};

exports.getUserProfile = (req, res) => {
  const { userId } = req.session;

  console.log(userId);
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
};

exports.getOthersProfile = (req, res) => {
  const { userId } = req.params;

  db.query(
    'SELECT username, profilePicture, location, interests, sustainabilityScore FROM User WHERE userID = ? AND active = 1',
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
};

exports.updateUserProfile = (req, res) => {
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
        return res.status(400).json({ message: 'No valid fields to update.' });
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
};

exports.deactivateAccount = (req, res) => {
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
};

exports.getUserInteractions = (req, res) => {
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
};

exports.getUsersContributions = (req, res) => {
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
};

exports.refreshToken = (req, res) => {
  // we assume a user is already authenticated, and we'll generate a new access token for them

  const { user } = req; // User information obtained during authentication

  const secretKey = generateSecretKey();
  const options = { expiresIn: '1h' }; // Token expiration time

  const accessToken = jwt.sign(user, secretKey, options);

  return res.json({ accessToken });
};

exports.searchUsers = (req, res) => {
  const { query } = req.query; // Assuming you pass the search query as a query parameter

  db.query(
    'SELECT userID, username, email FROM User WHERE username LIKE ? OR email LIKE ?',
    [`%${query}%`, `%${query}%`],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Internal server error.' });
      }

      return res.json({ users: results });
    },
  );
};

exports.logoutUser = (req, res) => {
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
};
