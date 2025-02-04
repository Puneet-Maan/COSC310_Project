const express = require('express');
const pool = require('./routes/db'); // Import MySQL connection
const authRoutes = require('./routes/auth'); // Import authentication routes
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/api', authRoutes); // Use authentication routes under the /api path

// Test route to check if the server is running
app.get("/api", (req, res) => {
  res.json({ "users": ["userOne", "userTwo", "userThree"] });
});

// Test route to check the database connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW()'); // Query the database to get the current time
    res.json({ message: 'Database connected!', time: rows[0]}); // Respond with the current time
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: 'Database connection failed', error: err.message }); // Respond with an error message
  }
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});