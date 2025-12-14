// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/signup - User signup
router.post('/signup', authController.signup);

// POST /api/login - User login
router.post('/login', authController.login);

module.exports = router;