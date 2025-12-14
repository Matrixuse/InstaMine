
const jwt = require('jsonwebtoken');
const config = require('../config/config');


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch (error) {

        return res.status(403).json({ message: 'Access Denied: Invalid token' });
    }
};

module.exports = { authenticateToken };