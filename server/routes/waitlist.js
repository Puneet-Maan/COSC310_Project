import express from 'express';
import pool from './db.js'; // Import MySQL connection

const router = express.Router();

// Add a student to the waitlist
router.post('/waitlist', async (req, res) => {
  const { student_id, section_id } = req.body;

  if (!student_id || !section_id) {
    return res.status(400).json({ error: 'Student ID and Section ID are required' });
  }

  try {
    const connection = await pool.getConnection();
    // Check if the student is already on the waitlist for the section
    const [existing] = await connection.execute(
      'SELECT * FROM waitlist WHERE student_id = ? AND section_id = ?',
      [student_id, section_id]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({ error: 'Student is already on the waitlist for this section' });
    }

    // Add the student to the waitlist
    const [rows] = await connection.execute(
      'INSERT INTO waitlist (student_id, section_id) VALUES (?, ?)',
      [student_id, section_id]
    );
    connection.release();

    res.json({ success: true });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
});

// Get the waitlist for all sections
router.get('/waitlist', async (req, res) => {
  const { section_id } = req.query;

  try {
    const connection = await pool.getConnection();
    const [rows] = section_id
      ? await connection.execute('SELECT * FROM waitlist WHERE section_id = ?', [section_id])
      : await connection.execute('SELECT * FROM waitlist');
    connection.release();

    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
});

// Remove a student from the waitlist
router.delete('/waitlist', async (req, res) => {
  const { student_id, section_id } = req.body;

  if (!student_id || !section_id) {
    return res.status(400).json({ error: 'Student ID and Section ID are required' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'DELETE FROM waitlist WHERE student_id = ? AND section_id = ?',
      [student_id, section_id]
    );
    connection.release();

    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Waitlist entry not found' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
});

export default router;
