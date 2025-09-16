const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Mock database (for demonstration purposes)
const users = [];

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('User registered');
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user) return res.status(400).send('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Invalid password');

    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

// Logout endpoint
router.post('/logout', (req, res) => {
    // Invalidate token client-side
    res.send('Logged out');
});

module.exports = router;