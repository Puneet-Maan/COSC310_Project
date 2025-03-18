const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming a database connection is set up in db.js

router.get('/student-courses/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const query = `
      SELECT 
        e.enrollment_id,
        s.section_number,
        s.instructor,
        s.schedule,
        s.room,
        e.grade
      FROM enrollments e
      JOIN sections s ON e.section_id = s.section_id
      WHERE e.student_id = ?
    `;
    const [results] = await db.execute(query, [studentId]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
