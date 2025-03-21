const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user; // Attach decoded token payload to the request object
    next();
  });
};

// GET route to fetch student profile
router.get('/:id', authenticateToken, async (req, res) => {
  const studentId = req.params.id;

  try {
    const [rows] = await db.query('SELECT name, age, major FROM students WHERE id = ?', [studentId]);

    if (rows.length > 0) {
      res.json(rows[0]); // Return the profile data
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error fetching student profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT route to update student profile
router.put('/:id', authenticateToken, async (req, res) => {
  const studentId = req.params.id;
  const { name, age, major } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE students SET name = ?, age = ?, major = ? WHERE id = ?',
      [name, age, major, studentId]
    );

    if (result.affectedRows > 0) {
      const [updatedProfile] = await db.query('SELECT name, age, major FROM students WHERE id = ?', [studentId]);
      res.json(updatedProfile[0]); // Return the updated profile data
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error updating student profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
