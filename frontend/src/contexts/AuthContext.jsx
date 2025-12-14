// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api/apiService.js'; // Added .js extension

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        setIsAuthenticated(!!token);
    }, [token]);

    const handleLoginSuccess = (newToken, newUserId, newUsername) => {
        setToken(newToken);
        setUserId(newUserId);
        setUsername(newUsername);
        localStorage.setItem('token', newToken);
        localStorage.setItem('userId', newUserId);
        localStorage.setItem('username', newUsername);
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        setUsername(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    };

    const value = {
        isAuthenticated,
        token,
        userId,
        username,
        handleLoginSuccess,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};