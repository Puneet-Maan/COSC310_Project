const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');

const jwtSecret = 'your_jwt_secret'; // Keep your secret secure

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
    req.user = user; // Attach decoded token payload to the request object (assuming role is included)
    next();
  });
};

// Helper function to check if a user has a specific role (for authorization)
const authorizeRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    return res.status(403).json({ message: 'Unauthorized: Admin role required' });
  }
};

// Use authorizeRole middleware for all admin routes
router.use(authenticateToken, authorizeRole('admin'));

// Get all students
router.get('/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, age, major, user_id FROM students');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific student by ID (basic info)
router.get('/students/:id', async (req, res) => {
  const studentId = parseInt(req.params.id);
  try {
    const [rows] = await pool.query('SELECT id, name, email, age, major, user_id FROM students WHERE id = ?', [studentId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific student's details with enrollments and waitlist
router.get('/students/:studentId/details', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  try {
    const [studentRows] = await pool.query('SELECT id, name, email, age, major, user_id FROM students WHERE id = ?', [studentId]);
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const student = studentRows[0];

    const [enrolledRows] = await pool.query(
      'SELECT c.id, c.name, c.code, c.instructor, c.schedule FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?',
      [student.user_id] // Use user_id to join with enrollments
    );

    const [waitlistRows] = await pool.query(
      'SELECT c.id, c.name, c.code, wl.position FROM waitlist wl JOIN courses c ON wl.course_id = c.id WHERE wl.student_id = ? ORDER BY wl.position',
      [student.user_id] // Use user_id to query waitlist
    );

    res.json({ student, enrolledCourses: enrolledRows, waitlistedCourses: waitlistRows });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get completed courses for a specific student WITH COURSE CREDITS
router.get('/students/:studentId/completed-courses', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  try {
    const [completedCourseRows] = await pool.query(
      'SELECT cc.completion_date, cc.grade, ' +
      'c.id AS course_id, c.name AS course_name, c.code AS course_code, c.instructor AS course_instructor, c.credits AS credits ' +
      'FROM completed_courses cc JOIN courses c ON cc.course_id = c.id WHERE cc.student_id = ?',
      [studentId]
    );
    res.json(completedCourseRows);
  } catch (error) {
    console.error('Error fetching completed courses with credits:', error);
    res.status(500).json({ message: 'Failed to fetch completed courses with credits.' });
  }
});

// Add a new student
router.post('/students', async (req, res) => {
  const { name, email, age, major, user_id } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO students (name, email, age, major, user_id) VALUES (?, ?, ?, ?, ?)', [name, email, age, major, user_id]);
    res.status(201).json({ id: result.insertId, name, email, age, major, user_id });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a student's basic info
router.put('/students/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const { name, email, age, major } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE students SET name = ?, email = ?, age = ?, major = ? WHERE id = ?',
      [name, email, age, major, studentId]
    );
    if (result.affectedRows > 0) {
      const [updatedStudentRows] = await pool.query('SELECT id, name, email, age, major, user_id FROM students WHERE id = ?', [studentId]);
      res.json(updatedStudentRows[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Enroll a student in a course
router.post('/students/:studentId/enroll', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const { courseCode } = req.body;
  try {
    const [studentRows] = await pool.query('SELECT user_id FROM students WHERE id = ?', [studentId]);
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const userId = studentRows[0].user_id;

    const [courseRows] = await pool.query('SELECT id, capacity, enrolled FROM courses WHERE code = ?', [courseCode]);
    if (courseRows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const course = courseRows[0];

    // Check if the student is already enrolled
    const [existingEnrollment] = await pool.query('SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?', [userId, course.id]);
    if (existingEnrollment.length > 0) {
      return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }

    // Check course capacity
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ message: 'Course capacity reached' });
    }

    await pool.query('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [userId, course.id]);
    await pool.query('UPDATE courses SET enrolled = enrolled + 1 WHERE id = ?', [course.id]);

    // Remove student from waitlist if they were on it
    await pool.query('DELETE FROM waitlist WHERE student_id = ? AND course_id = ?', [userId, course.id]);

    // Fetch updated enrolled courses for the response
    const [updatedEnrolledRows] = await pool.query(
      'SELECT c.id, c.name, c.code, c.instructor, c.schedule FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?',
      [userId]
    );

    res.json({ message: 'Student enrolled successfully', enrolledCourses: updatedEnrolledRows });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Drop a student from a course
router.post('/students/:studentId/drop', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const { courseId } = req.body;
  try {
    const [studentRows] = await pool.query('SELECT user_id FROM students WHERE id = ?', [studentId]);
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const userId = studentRows[0].user_id;

    const [result] = await pool.query('DELETE FROM enrollments WHERE student_id = ? AND course_id = ?', [userId, courseId]);
    if (result.affectedRows > 0) {
      await pool.query('UPDATE courses SET enrolled = enrolled - 1 WHERE id = ? AND enrolled > 0',
        [courseId]
      );

      // Fetch updated enrolled courses for the response
      const [updatedEnrolledRows] = await pool.query(
        'SELECT c.id, c.name, c.code, c.instructor, c.schedule FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?',
        [userId]
      );

      res.json({ message: 'Student dropped successfully', enrolledCourses: updatedEnrolledRows });
    } else {
      res.status(404).json({ message: 'Enrollment not found for this student and course' });
    }
  } catch (error) {
    console.error('Error dropping student from course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a student
router.delete('/students/:id', async (req, res) => {
  const studentId = parseInt(req.params.id);
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [studentId]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Student deleted' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, code, instructor, schedule, capacity, enrolled, credits FROM courses');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses data. Please try again later.' });
  }
});

// Add a new course
router.post('/courses', async (req, res) => {
  const { name, code, instructor, schedule, capacity, enrolled, credits } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO courses (name, code, instructor, schedule, capacity, enrolled, credits) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, code, instructor, schedule, capacity, enrolled || 0, credits]);
    res.status(201).json({ id: result.insertId, name, code, instructor, schedule, capacity, enrolled: enrolled || 0, credits });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a course
router.put('/courses/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);
  const { name, code, instructor, schedule, capacity, enrolled, credits } = req.body;
  try {
    const [result] = await pool.query('UPDATE courses SET name = ?, code = ?, instructor = ?, schedule = ?, capacity = ?, enrolled = ?, credits = ? WHERE id = ?',
      [name, code, instructor, schedule, capacity, enrolled, credits, courseId]);
    if (result.affectedRows > 0) {
      res.json({ id: courseId, name, code, instructor, schedule, capacity, enrolled, credits });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a course
router.delete('/courses/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);
  try {
    const [result] = await pool.query('DELETE FROM courses WHERE id = ?', [courseId]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Course deleted' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;