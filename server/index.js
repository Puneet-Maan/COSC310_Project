const express = require('express');
const pool = require('./routes/db'); // Import MySQL connection
const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ "users": ["userOne", "userTwo", "userThree"] });
});

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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});