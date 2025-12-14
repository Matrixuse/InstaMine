
const { MOCK_DB, generateId, mockHash } = require('../config/db');



const findUserByUsername = (username) => {
    return MOCK_DB.users.find(u => u.username === username);
};

const findUserById = (userId) => {
    return MOCK_DB.users.find(u => u.id === userId);
};

const createUser = (username, password) => {
    const userId = generateId();
    const passwordHash = mockHash(password);
    
    const newUser = { id: userId, username, passwordHash };
    MOCK_DB.users.push(newUser);
    return newUser;
};

module.exports = {
    findUserByUsername,
    findUserById,
    createUser,
};