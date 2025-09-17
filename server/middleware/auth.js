const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

// Middleware for authenticating users using JWT
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers['authorization']?.split(' ')[1];

        // If no token, return unauthorized error
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        // If user not found, return unauthorized error
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized user.' });
        }

        // Proceed to next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = authMiddleware;