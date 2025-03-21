const express = require('express');
const router = express.Router();
const db = require('../../db'); // Adjust the path to your database connection file

// Get all available courses
router.get('/', async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM courses');
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all courses the student is enrolled in
router.get('/enrolled-courses/:student_id', async (req, res) => {
  const { student_id } = req.params;

  try {
    const [enrolledCourses] = await db.query(
      'SELECT c.* FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE e.student_id = ?',
      [student_id]
    );
    res.json(enrolledCourses);
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student profile by ID with enrolled and waitlisted courses
router.get('/students/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const [studentData] = await db.query('SELECT * FROM students WHERE id = ?', [studentId]);
    if (!studentData.length) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = studentData[0];

    const [enrolledCourses] = await db.query(
      'SELECT c.* FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE e.student_id = ?', 
      [studentId]
    );

    const [waitlistedCourses] = await db.query(
      'SELECT c.* FROM courses c JOIN waitlist w ON c.id = w.course_id WHERE w.student_id = ?', 
      [studentId]
    );

    res.json({ student, enrolledCourses, waitlistedCourses });
  } catch (err) {
    console.error('Error fetching student profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students with waitlist details
router.get('/students', async (req, res) => {
  try {
    const [students] = await db.query(
      `SELECT s.*, 
              CASE 
                WHEN w.student_id IS NOT NULL THEN 'Yes'
                ELSE 'No'
              END AS waitlist_status,
              c.name AS course_name 
       FROM students s
       LEFT JOIN waitlist w ON s.id = w.student_id
       LEFT JOIN courses c ON w.course_id = c.id`
    );
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notifications for a student
router.get('/notifications/:student_id', async (req, res) => {
  const { student_id } = req.params;

  try {
    const [notifications] = await db.query('SELECT * FROM notifications WHERE student_id = ?', [student_id]);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE notification by ID
router.delete('/notifications/:id', async (req, res) => {
  const { id } = req.params; // Get notification ID from URL parameter

  try {
    // Check if the notification exists in the database
    const [notification] = await db.query('SELECT * FROM notifications WHERE id = ?', [id]);
    if (notification.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Delete the notification from the database
    await db.query('DELETE FROM notifications WHERE id = ?', [id]);

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification. Please try again.' });
  }
});


module.exports = router;
