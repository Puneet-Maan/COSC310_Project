// Import required modules
import express from 'express'; // Import Express to create and handle routes
import pool from './db.js'; // Import the database connection from db.js

// Create a new Express router to handle routes related to the waitlist
const router = express.Router(); 

// ==============================
// Route: GET /waitlist/
// Description: Fetch all waitlist entries
// ==============================
router.get('/', async (req, res) => {
  try {
    // Query the database to fetch all entries from the waitlist table
    const [rows] = await pool.query('SELECT * FROM waitlist');
    
    // Send the fetched waitlist data as a JSON response
    res.json(rows);
  } catch (err) {
    console.error('Error fetching waitlist:', err);
    
    // If an error occurs while querying the database, send a 500 Internal Server Error
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ==============================
// Route: GET /waitlist/course/:course_id
// Description: Fetch waitlisted students for a specific course
// ==============================
router.get('/course/:course_id', async (req, res) => {
  // Extract course_id from the request URL parameters
  const { course_id } = req.params;

  try {
    // Query the database to get all students waitlisted for the given course
    const [rows] = await pool.query('SELECT * FROM waitlist WHERE course_id = ?', [course_id]);

    // Send the list of waitlisted students for that course as a JSON response
    res.json(rows);
  } catch (err) {
    console.error('Error fetching waitlisted students:', err);
    
    // Handle database errors with a 500 Internal Server Error
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ==============================
// Route: POST /waitlist/
// Description: Add a student to the waitlist for a specific section
// ==============================
router.post('/', async (req, res) => {
  // Extract student_id and section_id from the request body (data sent by the client)
  const { student_id, section_id } = req.body;

  // Check if both student_id and section_id are provided in the request
  if (!student_id || !section_id) {
    // If either student_id or section_id is missing, send a 400 Bad Request error
    return res.status(400).json({ message: 'Missing student_id or section_id' });
  }

  try {
    // Insert a new entry into the waitlist table with the provided student_id and section_id
    const [result] = await pool.query(
      'INSERT INTO waitlist (student_id, section_id) VALUES (?, ?)', 
      [student_id, section_id] // Parameters to safely insert into the query
    );

    // Send a success response with the newly inserted waitlist entry's ID
    res.status(201).json({ message: 'Student added to waitlist', waitlist_id: result.insertId });
  } catch (err) {
    console.error('Error adding to waitlist:', err);
    
    // Handle any database errors by sending a 500 Internal Server Error
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ==============================
// Route: DELETE /waitlist/:waitlist_id
// Description: Remove a student from the waitlist by their waitlist entry ID
// ==============================
router.delete('/:waitlist_id', async (req, res) => {
  // Extract waitlist_id from the request URL parameters
  const { waitlist_id } = req.params;

  try {
    // Query the database to delete the waitlist entry with the specified waitlist_id
    const [result] = await pool.query('DELETE FROM waitlist WHERE waitlist_id = ?', [waitlist_id]);
    
    // If no entry was deleted, it means the waitlist_id was not found in the database
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Waitlist entry not found' });
    }

    // If successful, send a response confirming the student was removed
    res.json({ message: 'Student removed from waitlist' });
  } catch (err) {
    console.error('Error removing from waitlist:', err);
    
    // Handle errors with a 500 Internal Server Error response
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Export the router so it can be used in the main application
export default router;
