import express from "express";
import pool from "../routes/db.js";
import fs from "fs";
import { Parser } from "json2csv";  // Install json2csv for CSV conversion
import { stringify } from "csv-stringify"; // Install csv-stringify for CSV conversion

const router = express.Router();

// Fetch students
router.get("/students", async (req, res) => {
  try {
    const [students] = await pool.query("SELECT * FROM students");

    if (!Array.isArray(students)) {
      return res.json([]);
    }

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export students in JSON format
router.get("/students/export/json", async (req, res) => {
  try {
    const [students] = await pool.query("SELECT * FROM students");

    if (!students) {
      return res.status(404).json({ message: "No students found." });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=students_report.json");
    res.send(JSON.stringify(students, null, 2));
  } catch (error) {
    console.error("Error exporting students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export students in CSV format
router.get("/students/export/csv", async (req, res) => {
  try {
    const [students] = await pool.query("SELECT * FROM students");

    if (!students) {
      return res.status(404).json({ message: "No students found." });
    }

    const parser = new Parser();
    const csvData = parser.parse(students);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=students_report.csv");
    res.send(csvData);
  } catch (error) {
    console.error("Error exporting students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export students in TXT format
router.get("/students/export/txt", async (req, res) => {
  try {
    const [students] = await pool.query("SELECT * FROM students");

    if (!students) {
      return res.status(404).json({ message: "No students found." });
    }

    let txtData = students.map(student => 
      `Name: ${student.name}, Course: ${student.course}, Grade: ${student.grade}`
    ).join("\n");

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", "attachment; filename=students_report.txt");
    res.send(txtData);
  } catch (error) {
    console.error("Error exporting students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
