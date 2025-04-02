const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

const jwtSecret = 'your_jwt_secret'; // Hardcoded secret for simplicity
const saltRounds = 10;

// POST route for registration
router.post('/register', async (req, res) => {
  const { name, email, age, major, username, password } = req.body;
  console.log('Registration request received:', { name, email, age, major, username }); // Log request body

  try {
    // 1. Check if the username or email already exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    console.log('Existing user check result:', existingUser); // Log the result of the check
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hashedPassword); // Log the hashed password

    // 3. Insert into the users table
    const insertUserSql = 'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)';
    const insertUserValues = [username, hashedPassword, 'student', email];
    console.log('Insert user SQL:', insertUserSql, insertUserValues); // Log the SQL and values
    const [userResult] = await db.query(insertUserSql, insertUserValues);
    const newUserId = userResult.insertId;
    console.log('User insert result:', userResult, 'New User ID:', newUserId);

    // 4. Insert into the students table, linking to the new user
    const insertStudentSql = 'INSERT INTO students (name, email, age, major, user_id) VALUES (?, ?, ?, ?, ?)';
    const insertStudentValues = [name, email, parseInt(age), major, newUserId];
    console.log('Insert student SQL:', insertStudentSql, insertStudentValues); // Log the SQL and values
    const [studentResult] = await db.query(insertStudentSql, insertStudentValues);
    const newStudentId = studentResult.insertId;
    console.log('Student insert result:', studentResult, 'New Student ID:', newStudentId);

    res.status(201).json({ message: 'Registration successful! You can now log in.' });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error during registration. Please try again later.' });
  }
});

// POST route for login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database for the user
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length > 0) {
      const user = rows[0];

      // Compare password with hashed password
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // Generate a JWT and include the role in the payload
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, jwtSecret, { expiresIn: '1h' });

        // Send the token and user profile in the response
        res.json({ success: true, message: 'Login successful', token, user });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST route to update student password
router.post('/profile/:id/update-password', authenticateToken, async (req, res) => {
  const studentId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Find the user associated with the student ID
    const [studentRows] = await db.query('SELECT user_id FROM students WHERE id = ?', [studentId]);
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    const userId = studentRows[0].user_id;

    // 2. Find the user in the users table
    const [userRows] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User account not found.' });
    }
    const hashedPasswordFromDb = userRows[0].password;

    // 3. Compare the provided current password with the hashed password from the database
    const isMatch = await bcrypt.compare(currentPassword, hashedPasswordFromDb);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    // 4. Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 5. Update the password in the users table
    const [updateResult] = await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, userId]
    );

    if (updateResult.affectedRows > 0) {
      return res.json({ message: 'Password updated successfully!' });
    } else {
      return res.status(500).json({ message: 'Failed to update password.' });
    }

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error updating password.' });
  }
});

module.exports = router;