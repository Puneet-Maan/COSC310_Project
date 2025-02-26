const express = require("express");
const router = express.Router();
const db = require("../db"); // Import your MySQL connection

// Add a Course
router.post("/create-course", (req, res) => {
  const { name, description, instructor } = req.body;
  if (!name || !description || !instructor) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "INSERT INTO courses (name, description, instructor) VALUES (?, ?, ?)";
  db.query(query, [name, description, instructor], (err, result) => {
    if (err) {
      console.erro6r("Error creating course:", err);
      return res.status(500).json({ message: "Failed to create course." });
    }
    res.status(201).json({ message: "Course created successfully", courseId: result.insertId });
  });
});

// Update Student Grade
router.put("/update-grade/:userId", (req, res) => {
  const { userId } = req.params;
  const { grade } = req.body;
  if (!grade) {
    return res.status(400).json({ message: "Grade is required." });
  }

  const query = "UPDATE users SET grade = ? WHERE id = ?";
  db.query(query, [grade, userId], (err, result) => {
    if (err) {
      console.error("Error updating grade:", err);
      return res.status(500).json({ message: "Failed to update grade." });
    }
    res.status(200).json({ message: "Grade updated successfully" });
  });
});

// Get All Courses
router.get("/courses", (req, res) => {
  const query = "SELECT * FROM courses";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.status(500).json({ message: "Failed to fetch courses." });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
