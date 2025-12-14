
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userModel = require('../models/userModel');
const { mockCompare } = require('../config/db');

const generateToken = (userId, username) => {
    return jwt.sign({ userId, username }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
};

const signup = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (userModel.findUserByUsername(username)) {
        return res.status(409).json({ message: 'Username already taken' });
    }

    try {
        const newUser = userModel.createUser(username, password);
        res.status(201).json({ message: 'User created successfully', userId: newUser.id });
    } catch (error) {
        next(error);
    }
};

const login = (req, res, next) => {
    const { username, password } = req.body;

    const user = userModel.findUserByUsername(username);


    if (!user || !mockCompare(password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.username);

    res.json({ 
        message: 'Login successful', 
        token, 
        userId: user.id, 
        username: user.username 
    });
};

module.exports = {
    signup,
    login,
};