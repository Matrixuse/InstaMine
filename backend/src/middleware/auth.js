// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Middleware to verify JWT and attach user ID to the request object.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Expects 'Bearer TOKEN'
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        // Attach the authenticated user ID to the request
        req.userId = decoded.userId;
        next();
    } catch (error) {
        // Token is invalid or expired
        return res.status(403).json({ message: 'Access Denied: Invalid token' });
    }
};

module.exports = { authenticateToken };