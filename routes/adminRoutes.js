const express = require('express');
const db = require('./db');

// Initialize the router
const router = express.Router();

// Create a new course
router.post('/create-course', async (req, res) => {
  const { name, description, instructor } = req.body;
  if (!name || !description || !instructor) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO courses (name, description, instructor) VALUES (?, ?, ?)', 
      [name, description, instructor]
    );
    res.status(201).json({ message: 'Course created successfully', courseId: result.insertId });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user grade
router.put('/update-grade', async (req, res) => {
  const { userId, grade } = req.body;
  if (!userId || !grade) {
    return res.status(400).json({ message: 'User ID and grade are required' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET grade = ? WHERE id = ?',
      [grade, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Grade updated successfully' });
  } catch (error) {
    console.error('Error updating grade:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
