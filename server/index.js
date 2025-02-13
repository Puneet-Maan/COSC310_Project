import express from 'express';
import pool from './routes/db.js'; // Import MySQL connection
import authRoutes from './routes/auth.js'; // Import authentication routes
import serverRoutes from './routes/server.js'; // Import API routes from server.js
import waitlistRoutes from './routes/waitlist.js'; // Import waitlist routes

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

// Authentication routes (if you have any)
app.use('/api/auth', authRoutes); // Use authentication routes under the /api/auth path

// Use the API routes from server.js under /api path
app.use('/api', serverRoutes); // This will handle /api/courses and other routes from server.js

// Waitlist API routes
app.use('/api/waitlist', waitlistRoutes);

// Test route to check if the server is running
app.get("/api", (req, res) => {
  res.json({ "users": ["userOne", "userTwo", "userThree"] });
});

// Test route to check the database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW()'); // Query the database to get the current time
    res.json({ message: 'Database connected!', time: rows[0] }); // Respond with the current time
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: 'Database connection failed', error: err.message }); // Respond with an error message
  }
});

// Start the server on port 5001
const server = app.listen(5001, () => {
  console.log("Server is running on port 5001");
});

export { app, server }; // Exporting app and server
