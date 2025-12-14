// src/models/userModel.js
const { MOCK_DB, generateId, mockHash } = require('../config/db');

// In a real app, these would be SQL queries using a database driver (e.g., 'pg' or 'mysql2').

const findUserByUsername = (username) => {
    return MOCK_DB.users.find(u => u.username === username);
};

const findUserById = (userId) => {
    return MOCK_DB.users.find(u => u.id === userId);
};

const createUser = (username, password) => {
    const userId = generateId();
    const passwordHash = mockHash(password); // Simulate hashing
    
    const newUser = { id: userId, username, passwordHash };
    MOCK_DB.users.push(newUser);
    return newUser;
};

module.exports = {
    findUserByUsername,
    findUserById,
    createUser,
};