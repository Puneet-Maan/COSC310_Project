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
    const [rows] = await db.query('SELECT id, name, age, major, email FROM students WHERE id = ?', [studentId]); // Include email
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
  const { name, age, major, email } = req.body; // Include email in the request body

  try {
    const [result] = await db.query(
      'UPDATE students SET name = ?, age = ?, major = ?, email = ? WHERE id = ?',
      [name, age, major, email, studentId]
    );

    if (result.affectedRows > 0) {
      const [updatedProfile] = await db.query('SELECT name, age, major, email FROM students WHERE id = ?', [studentId]); // Fetch updated data
      res.json(updatedProfile[0]); // Return the updated profile data
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error('Error updating student profile:', err);
    if (err.code === 'ER_DUP_ENTRY' && err.message.includes('email')) {
      return res.status(400).json({ message: 'This email address is already in use.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch completed courses for a student
router.get('/:id/completed-courses', authenticateToken, async (req, res) => {
  const studentId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT
        c.id AS course_id,
        c.code AS course_code,
        c.name AS course_name,
        c.instructor AS course_instructor,
        gc.completion_date,
        gc.grade,
        c.credits
      FROM
        completed_courses AS gc
      JOIN
        courses AS c ON gc.course_id = c.id
      WHERE
        gc.student_id = ?`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching completed courses:', err);
    res.status(500).json({ message: 'Server error fetching completed courses.' });
  }
});

module.exports = router;