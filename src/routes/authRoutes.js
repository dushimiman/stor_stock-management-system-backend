const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { JWT_SECRET } = require('../config');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request for:', username);

    try {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            console.log('Database query results:', results);
            const user = results[0];

            if (!user) {
                console.log('User not found:', username);
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password comparison result:', isMatch);

            if (!isMatch) {
                console.log('Password does not match for user:', username);
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            console.log('User logged in successfully:', username);
            res.json({ token });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

module.exports = router;
