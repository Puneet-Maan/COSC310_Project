import express from "express";
import db from "./db.js"; // Corrected import path for db.js

const router = express.Router();

// Add a Course
router.post("/create-course", async (req, res) => {
  const { name, description, instructor } = req.body;
  if (!name || !description || !instructor) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "INSERT INTO courses (name, description, instructor) VALUES (?, ?, ?)";
  try {
    const [result] = await db.query(query, [name, description, instructor]);
    res.status(201).json({ message: "Course created successfully", courseId: result.insertId });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Failed to create course." });
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
    res.status(500).json({ message: "Failed to update grade." });
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
    res.status(500).json({ message: "Failed to fetch courses." });
  }
});

export default router;
