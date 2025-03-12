import express from "express";
import db from "./db.js"; // Corrected import path for db.js

const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  const { email } = req.body; // Assuming email is sent in the request body

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const query = "SELECT role FROM accounts WHERE email = ?";
  try {
    const [result] = await db.query(query, [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    if (result[0].role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    console.error("Error checking admin role:", err);
    res.status(500).json({ message: `Failed to check admin role: ${err.message}`, error: err });
  }
};

// Route to check if the current user is an admin
router.post("/check-admin", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const query = "SELECT role FROM accounts WHERE email = ?";
  try {
    const [result] = await db.query(query, [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const isAdmin = result[0].role === 'admin';
    res.status(200).json({ isAdmin });
  } catch (err) {
    console.error("Error checking admin role:", err);
    res.status(500).json({ message: `Failed to check admin role: ${err.message}`, error: err });
  }
});

// Add a Course
router.post("/add-course", isAdmin, async (req, res) => {
  const { course_code, course_name, department, credits, requires_lab } = req.body;
  console.log("Received data:", req.body);

  if (!course_code || !course_name || !department || !credits) {
    console.log("Missing fields:", { course_code, course_name, department, credits });
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "INSERT INTO courses (course_code, course_name, department, credits, requires_lab) VALUES (?, ?, ?, ?, ?)";
  try {
    const [result] = await db.query(query, [course_code, course_name, department, credits, requires_lab]);
    res.status(201).json({ message: "Course created successfully", courseId: result.insertId });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Failed to create course.", error: err.message });
  }
});

// Update Student Grade
router.put("/update-grade/:userId", isAdmin, async (req, res) => {
  const { userId } = req.params;
  const { grade } = req.body;
  if (!grade) {
    return res.status(400).json({ message: "Grade is required." });
  }

  const query = "UPDATE users SET grade = ? WHERE id = ?";
  try {
    await db.query(query, [grade, userId]);
    res.status(200).json({ message: "Grade updated successfully" });
  } catch (err) {
    console.error("Error updating grade:", err);
    res.status(500).json({ message: "Failed to update grade.", error: err.message });
  }
});

// Get All Courses
router.get("/courses", isAdmin, async (req, res) => {
  const query = "SELECT * FROM courses";
  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Failed to fetch courses.", error: err.message });
  }
});

// Delete a Course
router.delete("/delete-course/:courseId", isAdmin, async (req, res) => {
  const { courseId } = req.params;

  // Check if the course exists before attempting to delete
  const checkQuery = "SELECT * FROM courses WHERE id = ?";
  const deleteQuery = "DELETE FROM courses WHERE id = ?";

  try {
    const [course] = await db.query(checkQuery, [courseId]);

    if (course.length === 0) {
      return res.status(404).json({ message: "Course not found." });
    }

    await db.query(deleteQuery, [courseId]);
    res.status(200).json({ message: "Course deleted successfully." });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Failed to delete course.", error: err.message });
  }
});

export default router;