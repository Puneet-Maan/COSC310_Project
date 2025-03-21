const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

const jwtSecret = 'your_jwt_secret'; // Hardcoded secret for simplicity

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

module.exports = router;
