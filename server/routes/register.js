import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from './db.js'; // Import MySQL connection

const router = express.Router();

router.post('/', [
  body('email').isEmail(),
  body('password').matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
  body('name').notEmpty(),
  body('phone').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, phone } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'INSERT INTO accounts (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, 'student', password]
    );
    connection.release();

    res.json({ success: true });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
});

export default router;
