import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Fix __dirname for ES Modules
import pool from './routes/db.js'; // Import MySQL connection
import authRoutes from './routes/auth.js'; // Import authentication routes
import registerRoute from './routes/register.js'; // Import registration route
import adminRoutes from './routes/adminRoutes.js'; // Import admin routes

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Allow dynamic port assignment

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use('/api', authRoutes); // Use authentication routes under the /api path
app.use('/api/register', registerRoute); // Use registration route under the /api/register path
app.use("/admin", adminRoutes); // All admin routes will start with /admin

// Test route to check if the server is running
app.get("/api", (req, res) => {
  res.json({ "users": ["userOne", "userTwo", "userThree"] });
});

// Test route to check the database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW()'); // Query the database to get the current time
    res.json({ message: 'Database connected!', time: rows[0]}); // Respond with the current time
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: 'Database connection failed', error: err.message }); // Respond with an error message
  }
});

// **API Route: Get All Courses**
app.get("/api/courses", async (req, res) => {
  try {
    const [courses] = await pool.query(
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
app.get("/api/courses/:code", async (req, res) => {
  const courseCode = req.params.code.toUpperCase();
  try {
    const [courses] = await pool.query("SELECT * FROM courses WHERE course_code = ?", [courseCode]);
    if (courses.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(courses[0]);
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// **Admin Route: Get All Courses**
app.get("/admin/courses", async (req, res) => {
  try {
    const [courses] = await pool.query("SELECT * FROM courses");
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses available" });
    }
    res.json(courses);
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server on port 5000
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

export default app;