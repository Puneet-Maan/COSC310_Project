import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js"; // MySQL connection

// Load environment variables
dotenv.config();

const router = express.Router(); // Use Router to define API routes

// Middleware
router.use(cors());
router.use(express.json());

// **API Route: Get All Courses**
router.get("/courses", async (req, res) => {
    try {
        const [courses] = await db.query(
            "SELECT course_code, course_name, department, credits, requires_lab FROM courses"
        );

        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses available" });
        }
        res.json(courses);
    } catch (error) {
        console.error("❌ Error fetching courses:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// **API Route: Get Specific Course by Course Code**
router.get("/courses/:code", async (req, res) => {
    const courseCode = req.params.code.toUpperCase();
    try {
        const [courses] = await db.query("SELECT * FROM courses WHERE course_code = ?", [courseCode]);
        if (courses.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(courses[0]);
    } catch (error) {
        console.error("❌ Error fetching course:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Export the router for use in index.js
export default router;
