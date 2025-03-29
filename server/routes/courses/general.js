const express = require('express');
const router = express.Router();
const { executeQuery } = require('../../helpers/dbHelper'); // Import the helper function

// Get all available courses
router.get('/', async (req, res, next) => {
  try {
    const courses = await executeQuery('SELECT * FROM courses');
    res.json(courses);
  } catch (err) {
    next(err); // Pass the error to the middleware
  }
});

// Get all courses the student is enrolled in
router.get('/enrolled-courses/:student_id', async (req, res, next) => {
  const { student_id } = req.params;

  try {
    const enrolledCourses = await executeQuery(
      'SELECT c.* FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE e.student_id = ?',
      [student_id]
    );
    res.json(enrolledCourses);
  } catch (err) {
    next(err); // Pass the error to the middleware
  }
});

// Get student profile by ID with enrolled and waitlisted courses
router.get('/students/:studentId', async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const studentData = await executeQuery('SELECT * FROM students WHERE id = ?', [studentId]);
    if (!studentData.length) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = studentData[0];

    const enrolledCourses = await executeQuery(
      'SELECT c.* FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE e.student_id = ?',
      [studentId]
    );

    const waitlistedCourses = await executeQuery(
      'SELECT c.* FROM courses c JOIN waitlist w ON c.id = w.course_id WHERE w.student_id = ?',
      [studentId]
    );

    res.json({ student, enrolledCourses, waitlistedCourses });
  } catch (err) {
    next(err); // Pass the error to the middleware
  }
});

// Get all students with waitlist details
router.get('/students', async (req, res, next) => {
  try {
    const students = await executeQuery(
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
    next(err); // Pass the error to the middleware
  }
});

// Get notifications for a student
router.get('/notifications/:student_id', async (req, res, next) => {
  const { student_id } = req.params;

  try {
    const notifications = await executeQuery(
      'SELECT * FROM notifications WHERE student_id = ?',
      [student_id]
    );
    res.json(notifications);
  } catch (err) {
    next(err); // Pass the error to the middleware
  }
});

// DELETE notification by ID
router.delete('/notifications/:id', async (req, res, next) => {
  const { id } = req.params; // Get notification ID from URL parameter

  try {
    // Check if the notification exists in the database
    const notification = await executeQuery('SELECT * FROM notifications WHERE id = ?', [id]);
    if (notification.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Delete the notification from the database
    await executeQuery('DELETE FROM notifications WHERE id = ?', [id]);

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    next(err); // Pass the error to the middleware
  }
});

module.exports = router;