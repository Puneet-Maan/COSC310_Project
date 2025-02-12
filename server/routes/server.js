import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // Import path module
import { fileURLToPath } from "url"; // Fix __dirname for ES Modules
import db from "./db.js"; // Ensure db.js is updated to use ES modules

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Allow dynamic port assignment

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve Static Files (Fix the Error)
app.use(express.static(path.join(__dirname, "public")));

// **API Route: Get All Courses**
app.get("/api/courses", async (req, res) => {
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

// **Start the Server**
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});