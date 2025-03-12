import express from 'express';
import db from './db.js'; // Corrected import path for db.js
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    try {
        const [users] = await db.query(query, [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        res.status(200).json({ success: true, userName: user.name, phone: user.phone });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: `An error occurred. Please try again. Error: ${err.message}`, error: err });
    }
});

export default router;
