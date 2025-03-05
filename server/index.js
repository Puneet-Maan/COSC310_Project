import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Fix __dirname for ES Modules
import pool from './routes/db.js'; // Import MySQL connection
import authRoutes from './routes/auth.js'; // Import authentication routes
import registerRoute from './routes/register.js'; // Import registration route
import editAccRoute from './routes/editAcc.js'; // Import edit account route
import adminRoutes from './routes/adminRoutes.js'; // Import admin routes

// Environmental Variables
dotenv.config();


const app = express();
const port = process.env.PORT || 5000; // Allow dynamic port assignment

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use('/api', authRoutes); // Use authentication routes under the /api path
app.use('/api/register', registerRoute); // Use registration route under the /api/register path
app.use('/admin', adminRoutes); // Use admin routes under the /admin path
app.use('/api', editAccRoute); // Use edit account route under the /api path

// Handle OPTIONS requests
app.options('*', cors());

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

// Function to create a course
app.post("/admin/add-course", async (req, res) => {
  const { course_code, course_name, department, credits, requires_lab } = req.body;
  if (!course_code || !course_name || !department || !credits) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "INSERT INTO courses (course_code, course_name, department, credits, requires_lab) VALUES (?, ?, ?, ?, ?)";
  try {
    const [result] = await pool.query(query, [course_code, course_name, department, credits, requires_lab]);
    res.status(201).json({ message: "Course created successfully", courseId: result.insertId });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Failed to create course.", error: err.message });
  }
});

// Function to update student grade
app.put("/admin/update-grade/:userId", async (req, res) => {
  const { userId } = req.params;
  const { grade } = req.body;
  if (!grade) {
    return res.status(400).json({ message: "Grade is required." });
  }

  const query = "UPDATE users SET grade = ? WHERE id = ?";
  try {
    await pool.query(query, [grade, userId]);
    res.status(200).json({ message: "Grade updated successfully" });
  } catch (err) {
    console.error("Error updating grade:", err);
    res.status(500).json({ message: "Failed to update grade.", error: err.message });
  }
});

// Start the server on port 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;