import express from "express";
import db from "./db.js"; // Corrected import path for db.js

const router = express.Router();

// Add a Course
router.post("/add-course", async (req, res) => {
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
router.put("/update-grade/:userId", async (req, res) => {
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
router.get("/courses", async (req, res) => {
  const query = "SELECT * FROM courses";
  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Failed to fetch courses.", error: err.message });
  }
});

export default router;