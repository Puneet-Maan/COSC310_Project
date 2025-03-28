const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');

const jwtSecret = 'your_jwt_secret'; // Hardcoded secret for simplicity

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user; // Attach decoded token payload to the request object
    next();
  });
};

// Get all students
router.get('/students', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific student by ID
router.get('/students/:id', authenticateToken, async (req, res) => {
  const studentId = parseInt(req.params.id);
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [studentId]);
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

// Add a new student
router.post('/students', authenticateToken, async (req, res) => {
  const { name, email, age, major, user_id } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO students (name, email, age, major, user_id) VALUES (?, ?, ?, ?, ?)', [name, email, age, major, user_id]);
    res.status(201).json({ id: result.insertId, name, email, age, major, user_id });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a student
router.put('/students/:id', authenticateToken, async (req, res) => {
  const studentId = parseInt(req.params.id);
  const { name, email, age, major, user_id } = req.body;
  try {
    const [result] = await pool.query('UPDATE students SET name = ?, email = ?, age = ?, major = ?, user_id = ? WHERE id = ?', [name, email, age, major, user_id, studentId]);
    if (result.affectedRows > 0) {
      res.json({ id: studentId, name, email, age, major, user_id });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a student
router.delete('/students/:id', authenticateToken, async (req, res) => {
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
router.get('/courses', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses data. Please try again later.' });
  }
});

// Add a new course
router.post('/courses', authenticateToken, async (req, res) => {
  const { name, code, instructor, schedule, capacity, enrolled } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO courses (name, code, instructor, schedule, capacity, enrolled) VALUES (?, ?, ?, ?, ?, ?)', 
      [name, code, instructor, schedule, capacity, enrolled]);
    res.status(201).json({ id: result.insertId, name, code, instructor, schedule, capacity, enrolled });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a course
router.put('/courses/:id', authenticateToken, async (req, res) => {
  const courseId = parseInt(req.params.id);
  const { name, code, instructor, schedule, capacity, enrolled } = req.body;
  try {
    const [result] = await pool.query('UPDATE courses SET name = ?, code = ?, instructor = ?, schedule = ?, capacity = ?, enrolled = ? WHERE id = ?', 
      [name, code, instructor, schedule, capacity, enrolled, courseId]);
    if (result.affectedRows > 0) {
      res.json({ id: courseId, name, code, instructor, schedule, capacity, enrolled });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to fetch a student's profile by ID
router.get('/api/student/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
      const [studentData] = await db.query(`
          SELECT 
              users.name, 
              users.gpa, 
              COUNT(enrollments.course_id) AS total_courses
          FROM users
          LEFT JOIN enrollments 
          ON users.id = enrollments.student_id
          WHERE users.id = ?
          GROUP BY users.id
      `, [studentId]);

      if (studentData) {
          res.json(studentData);
      } else {
          res.status(404).json({ error: "Student not found" });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
  }
});



// Delete a course
router.delete('/courses/:id', authenticateToken, async (req, res) => {
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
