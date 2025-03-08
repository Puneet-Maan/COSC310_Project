import express from 'express';
import cors from 'cors';
import pool from './routes/db.js'; // Import MySQL connection
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static(path.join(__dirname, 'routes/public')));

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW()'); // Ensure pool is used
    res.json({ message: 'Database connected!', time: rows[0] });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// fetches all courses from db
app.get("/api/courses", async (req, res) => {
  try {
    console.log("✅ Fetching courses from the database...");
    const [rows] = await pool.query("SELECT * FROM courses");
    console.log("✅ Courses fetched:", rows);
    res.json(rows); //send fetched courses as json to client
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Null Pointers API! 🎉");
});

//fetch course details
app.get("/api/courses/:course_code", async (req, res) => { 
  try {
    const { course_code } = req.params; //extract course code
    console.log(`✅ Fetching details for course: ${course_code}`);

    const [rows] = await pool.query("SELECT * FROM courses WHERE course_code = ?", [course_code]);

    //if not found
    if (rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching course details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

export default app;