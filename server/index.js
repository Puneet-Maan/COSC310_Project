const express = require('express');
const pool = require('./routes/db'); // Import MySQL connection
const path = require('path'); // Import the path module

//const browseCourse = require('./routes/browseCourse'); // Import browseCourse route
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'routes/public')));


// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW()'); // Ensure pool is used
    res.json({ message: 'Database connected!', time: rows[0]});
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});
app.get("/api/courses", async (req, res) => {
  try {
    console.log("✅ Fetching courses from the database...");
    const [rows] = await pool.query("SELECT * FROM courses");
    console.log("✅ Courses fetched:", rows);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/" , (req, res) => { 
  res.send("Welcome to the Null Pointers API! 🎉");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});