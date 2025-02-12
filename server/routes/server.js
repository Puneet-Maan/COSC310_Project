require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import MySQL connection

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// **API Route: Get All Courses**
app.get("/api/courses", async (req, res) => {
    try {
        const [courses] = await db.query("SELECT course_code, course_name, department, credits, requires_lab FROM courses");
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
app.get("/api/courses/:code", async (req, res) => {
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

// **Start the Server**
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});