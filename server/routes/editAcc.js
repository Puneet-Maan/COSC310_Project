import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from './db.js'; // Import MySQL connection

const router = express.Router();

router.put('/user', [
  body('email').isEmail(),
  body('password').optional().matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/),
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
    let updateQuery;
    let updateValues;
    
    if (password) {
      updateQuery = 'UPDATE accounts SET name = ?, phone = ?, password = ? WHERE email = ?';
      updateValues = [name, phone, password, email];
    } else {
      updateQuery = 'UPDATE accounts SET name = ?, phone = ? WHERE email = ?';
      updateValues = [name, phone, email];
    }

    await connection.execute(updateQuery, updateValues);
    connection.release();

    res.json({ success: true });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
});

router.get('/user', async (req, res) => {
  const { email } = req.query; // Assuming email is passed as a query parameter
  try {
    const [rows] = await pool.query('SELECT name, email, phone FROM accounts WHERE email = ?', [email]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
});

export default router;
