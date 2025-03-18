import express from 'express';
import pool from './db.js'; // Use the provided db.js file for database connection

const router = express.Router();

router.get('/student-courses/:studentId', async (req, res) => {
  const { studentId } = req.params;
  
  console.log("Fetching courses for student ID:", studentId);

  try {
    // Updated query to reflect the actual database schema
    const query = `
      SELECT 
        e.enrollment_id,
        c.course_id,
        c.course_code,
        c.course_name,
        c.department,
        c.credits,
        c.requires_lab,
        e.grade,
        s.section_number,
        s.instructor,
        s.schedule,
        s.room
      FROM enrollments e
      JOIN courses c ON e.section_id = c.course_id
      LEFT JOIN sections s ON e.section_id = s.section_id
      WHERE e.student_id = ?
    `;
    
    console.log("Executing query for student courses");
    const [results] = await pool.execute(query, [studentId]);
    console.log("Courses fetched:", results.length);
    
    // If no courses are found, return an empty array instead of an error
    if (results.length === 0) {
      console.log("No courses found for student ID:", studentId);
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/students', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    console.error("Email is missing in the request.");
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Log the email we're searching for
    console.log("Searching for student with email:", email);
    
    // Fetch student details directly from the students table by email
    const [students] = await pool.query("SELECT * FROM students WHERE email = ? LIMIT 1", [email]);
    
    // Log the raw query result
    console.log("Raw student query result:", students);
    
    if (students.length === 0) {
      console.error("No student found with email:", email);
      return res.status(404).json({ message: "Student not found." });
    }

    // Return the first student that matches the email
    console.log("Returning student:", students[0]);
    return res.json(students[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Failed to fetch student.", error: error.message });
  }
});

router.post('/register-student', async (req, res) => {
  const { student_id, course_code } = req.body;

  console.log("Registering student:", { student_id, course_code }); // Log input data

  if (!student_id || !course_code) {
    console.error("Missing student_id or course_code");
    return res.status(400).json({ message: "Student ID and Course Code are required." });
  }

  try {
    // First, check if the course exists and get its ID
    const [courses] = await pool.query("SELECT * FROM courses WHERE course_code = ?", [course_code]);
    if (courses.length === 0) {
      console.error("Course not found for course_code:", course_code);
      return res.status(404).json({ message: "Course not found." });
    }
    
    const courseId = courses[0].course_id || courses[0].id; // Try both possible column names
    console.log("Found course:", courses[0]);
    console.log("Using course ID:", courseId);

    // Check if the student is already enrolled in the course
    const [existingEnrollment] = await pool.query(
      "SELECT * FROM enrollments WHERE student_id = ? AND section_id = ?",
      [student_id, courseId]
    );
    
    if (existingEnrollment.length > 0) {
      console.error("Student already enrolled:", { student_id, courseId });
      return res.status(400).json({ message: "Student is already enrolled in this course." });
    }

    // Generate a smaller enrollment ID (ensure it's within INT range)
    const enrollmentId = Math.floor(Math.random() * 1000000); // Much smaller number
    console.log("Generated enrollment ID:", enrollmentId);

    // First try to get the maximum enrollment_id to generate a new unique one
    try {
      const [maxIdResult] = await pool.query("SELECT MAX(enrollment_id) as max_id FROM enrollments");
      const maxId = maxIdResult[0].max_id || 0;
      const newId = maxId + 1;
      console.log("Using sequential enrollment ID:", newId);
      
      // Register the student in the course with sequential ID
      const query = "INSERT INTO enrollments (enrollment_id, student_id, section_id) VALUES (?, ?, ?)";
      const [result] = await pool.query(query, [newId, student_id, courseId]);
      
      console.log("Student registered successfully:", newId);
      res.status(201).json({
        message: "Student successfully registered in the course.",
        enrollmentId: newId,
      });
    } catch (seqError) {
      console.error("Error with sequential ID, trying random ID:", seqError);
      
      // Fallback to random ID if sequential fails
      const query = "INSERT INTO enrollments (student_id, section_id) VALUES (?, ?)";
      const [result] = await pool.query(query, [student_id, courseId]);
      
      console.log("Student registered with auto-increment ID:", result.insertId);
      res.status(201).json({
        message: "Student successfully registered in the course.",
        enrollmentId: result.insertId,
      });
    }
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Failed to register student.", error: error.message });
  }
});

// Add a new route to get account information by email
router.get('/account', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    console.error("Email is missing in the request.");
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    console.log("Fetching account for email:", email);
    
    // Get the account directly from the accounts table
    const [accounts] = await pool.query("SELECT user_id, name, email, role FROM accounts WHERE email = ? LIMIT 1", [email]);
    
    if (accounts.length === 0) {
      console.error("No account found with email:", email);
      return res.status(404).json({ message: "Account not found." });
    }

    // Return the account information (excluding sensitive data like password)
    console.log("Account found:", accounts[0]);
    return res.json(accounts[0]);
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ message: "Failed to fetch account.", error: error.message });
  }
});

export default router;
