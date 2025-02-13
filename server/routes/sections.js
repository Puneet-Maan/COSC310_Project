// Manages section details and auto-enrollment
import express from 'express';
import pool from './db.js'; // Import the database connection
import autoEnroll from '../services/autoEnrollment.js'; // Import the auto-enrollment function

const router = express.Router(); // Create a new router for handling section-related routes

// Update section capacity and trigger auto-enrollment
router.put('/:section_id/capacity', async (req, res) => {
  const { section_id } = req.params; // Extract the section_id from the URL parameters
  const { new_capacity } = req.body; // Extract the new_capacity from the request body

  try {
    // Query the database to update the capacity of the section
    await pool.query('UPDATE sections SET capacity = ? WHERE section_id = ?', [new_capacity, section_id]);

    // If the new capacity is greater than 0, check if auto-enrollment should occur
    if (new_capacity > 0) {
      await autoEnroll(section_id); // Call the autoEnroll function to enroll students from the waitlist
    }

    // Respond with a success message once the capacity is updated and auto-enrollment is checked
    res.json({ message: 'Section capacity updated and auto-enrollment checked' });
  } catch (err) {
    console.error('Error updating section capacity:', err); // Log any errors that occur during the process
    // Send an error response if something goes wrong (500 Internal Server Error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router; // Export the router so it can be used in the main app
