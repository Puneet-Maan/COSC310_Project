import express from 'express';
import pool from './db.js'; // Import MySQL connection

const router = express.Router();

// Define the login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body
  try {
    // Query the database to check if the email and password are valid
    const [rows] = await pool.query('SELECT * FROM students WHERE login_email = ? AND password = ?', [email, password]);
    if (rows.length > 0) {
      const user = rows[0]; // Get the user details
      res.json({ success: true, userName: user.name }); // Respond with success and the user's name
    } else {
      res.json({ success: false }); // Respond with failure if the credentials are invalid
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again.' }); // Respond with an error message
  }
});

export default router; // Export the router
