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

const SECRET_KEY = generateSecretKey();

exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user is already exists (Checking the email)
  db.query('SELECT * FROM User WHERE email = ?', [email], (error, results) => {
    if (error) {
      return res.status(500).json({
        message: 'Internal server error.',
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        message: 'Email already in use.',
      });
    }

    // Hash the password before storing it
    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        return res.status(500).json({ message: 'User registration failed.' });
      }

      // Create new user with the hashed password
      db.query(
        'INSERT INTO User (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (insertError) => {
          if (insertError) {
            return res
              .status(500)
              .json({ message: 'User registration failed.' });
          }

          const token = generateToken({ username, email });
          return res
            .status(201)
            .json({ message: 'User registered successfully.', token });
        }
      );
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  db.query('SELECT * FROM User WHERE email = ?', [email], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid data.' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (compareError, passwordMatch) => {
      if (compareError) {
        return res.status(500).json({ message: 'Internal server error.' });
      }
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid data.' });
      }

      // Passwords match; generate a token and send a successful response
      const token = generateToken({ email });
      return res.json({ message: 'Login successful.', token });
    });
  });
};

exports.getUserProfile = (req, res) => {
  const userId = req.params.userId;

  db.query(
    'SELECT username, email, profilePicture, location, interests, sustainabilityScore FROM User WHERE userID = ?',
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
    }
  );
};

exports.updateUserProfile = (req, res) => {
  const userId = req.params.userId;
  const { username, email, location, profilePicture, interests } = req.body;

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
      if (profilePicture) {
        updateFields.push('profilePicture = ?');
        updateValues.push(profilePicture);
      }
      if (interests) {
        updateFields.push('interests = ?');
        updateValues.push(interests);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No valid fields to update.' });
      }

      // Execute the update query
      const updateQuery = `UPDATE User SET ${updateFields.join(
        ', '
      )} WHERE userID = ?`;
      const queryValues = [...updateValues, userId];

      db.query(updateQuery, queryValues, (updateError) => {
        if (updateError) {
          return res.status(500).json({ message: 'Profile update failed.' });
        }

        return res.json({ message: 'Profile updated successfully.' });
      });
    }
  );
};

exports.authenticateUser = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: No token provided.' });
  }

  // Verify the token
  const secretKey = SECRET_KEY;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }

    // If the token is valid, attach the user's information to the request object
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  });
};

exports.getUsersContributions = (req, res) => {
  const userId = req.params.userId;

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

      const submissionCount = results[0].submissionCount;

      // Calculate contributions based on data submissions
      const contributions = submissionCount * 10; // Example calculation

      return res.json({ contributions });
    }
  );
};

exports.refreshToken = (req, res) => {
  // we assume a user is already authenticated, and we'll generate a new access token for them

  const user = req.user; // User information obtained during authentication

  const secretKey = SECRET_KEY;
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
    }
  );
};

exports.logoutUser = (req, res) => {
  // we're assuming a simple token-based authentication system

  // You might clear the token, session, or perform other logout-related actions here
  // For this example, we're returning a success message

  return res.json({ message: 'Logout successful.' });
};

// ------------- optional ---------------
// Function to generate a JSON Web Token (JWT)
function generateToken(payload) {
  const secretKey = SECRET_KEY;
  const options = { expiresIn: '1h' }; // Token expiration time

  return jwt.sign(payload, secretKey, options);
}

// Generate a strong, random secret key
const generateSecretKey = () => {
  const keyLength = 32; // 32 bytes (256 bits) key length
  return crypto.randomBytes(keyLength).toString('hex');
};
// ---------------------------------------
