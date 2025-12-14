// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// --- Middleware Setup ---
app.use(cors()); // Enable CORS for the frontend
app.use(bodyParser.json());

// --- Route Mounting ---
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Catch-all for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route Not Found' });
});

// --- Global Error Handler ---
app.use(errorHandler);

module.exports = app;