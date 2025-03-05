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

// Get the waitlist for a specific section
router.get('/waitlist', async (req, res) => {
  const { section_id } = req.query;

  if (!section_id) {
    return res.status(400).json({ error: 'Section ID is required' });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM waitlist WHERE section_id = ?', [section_id]);
    connection.release();

    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
});

export default router;
