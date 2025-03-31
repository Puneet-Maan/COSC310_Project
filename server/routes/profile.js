const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getStudentProfile, updateStudentProfile } = require('../services/profileService');
const db = require('../db'); // add this if not already imported

// GET route to fetch student profile (authenticated user)
router.get('/', authenticateToken, async (req, res) => {
  const studentId = req.user.id;

  try {
    const profile = await getStudentProfile(studentId);
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🆕 GET route to fetch student grades
router.get('/grades', authenticateToken, async (req, res) => {
  const studentId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT c.name AS course_name, e.grade
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = ?`,
      [studentId]
    );

    res.json(rows); // returns array of { course_name, grade }
  } catch (error) {
    console.error('Error fetching student grades:', error);
    res.status(500).json({ message: 'Failed to load grades.' });
  }
});

// PUT route to update student profile
router.put('/', authenticateToken, async (req, res) => {
  const studentId = req.user.id;
  const { name, age, major } = req.body;

  if (!name || !age || !major) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const updatedProfile = await updateStudentProfile(studentId, name, age, major);
    if (updatedProfile) {
      res.json(updatedProfile);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;