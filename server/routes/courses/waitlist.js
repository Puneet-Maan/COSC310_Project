const express = require('express');
const router = express.Router();
const db = require('../../db'); // Adjust the path to your database connection file

// Get all waitlisted students with course details
router.get('/waitlisted-students', async (req, res) => {
  try {
    const [waitlistedStudents] = await db.query(
      'SELECT w.student_id, w.course_id, s.name as student_name, s.email, s.age, s.major, w.position, ' +
      'c.name as course_name, c.code as course_code, c.instructor, c.schedule ' +
      'FROM waitlist w ' +
      'JOIN students s ON w.student_id = s.id ' +
      'JOIN courses c ON w.course_id = c.id ' +
      'ORDER BY w.position'
    );
    res.json(waitlistedStudents);
  } catch (err) {
    console.error('Error fetching waitlisted students:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all waitlisted courses for a student
router.get('/waitlisted-courses/:student_id', async (req, res) => {
  const { student_id } = req.params;

  try {
    const [waitlistedCourses] = await db.query(
      'SELECT c.* FROM courses c JOIN waitlist w ON c.id = w.course_id WHERE w.student_id = ?',
      [student_id]
    );
    res.json(waitlistedCourses);
  } catch (err) {
    console.error('Error fetching waitlisted courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a student from the waitlist
router.post('/remove-waitlist', async (req, res) => {
  const { student_id, course_id } = req.body;

  try {
    await db.query('DELETE FROM waitlist WHERE student_id = ? AND course_id = ?', [student_id, course_id]);
    res.json({ message: 'You have been removed from the waitlist.' });
  } catch (err) {
    console.error('Error removing from waitlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
