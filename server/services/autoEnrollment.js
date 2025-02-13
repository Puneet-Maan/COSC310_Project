// Handles automatic enrollment when a seat opens
import pool from '../db.js'; // Import the database connection

// Function to automatically enroll the first student on the waitlist for a given section
const autoEnroll = async (section_id) => {
  try {
    // Query the database to get the first student from the waitlist for this section (ordered by when they were added)
    const [waitlist] = await pool.query(
      'SELECT * FROM waitlist WHERE section_id = ? ORDER BY added_at ASC LIMIT 1', // Get the first student from the waitlist
      [section_id] // Use the provided section_id to filter the waitlist
    );

    // Check if there are students on the waitlist for this section
    if (waitlist.length > 0) {
      // Extract the student_id and waitlist_id for the first student
      const { student_id, waitlist_id } = waitlist[0];

      // Enroll the student by inserting them into the enrollments table
      await pool.query(
        'INSERT INTO enrollments (student_id, section_id) VALUES (?, ?)', // Add the student to the enrollments table
        [student_id, section_id] // Use the student_id and section_id to enroll them
      );

      // Remove the student from the waitlist after they've been enrolled
      await pool.query('DELETE FROM waitlist WHERE waitlist_id = ?', [waitlist_id]);

      // Log the successful auto-enrollment
      console.log(`Student ${student_id} auto-enrolled in section ${section_id}`);
    }
  } catch (err) {
    console.error('Error during auto-enrollment:', err); // Log any errors that occur
  }
};

export default autoEnroll; // Export the function to be used elsewhere in the app
