// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// GET /api/users/:userId - Get user profile (public, but auth for isFollowing check)
router.get('/:userId', userController.getProfile);

// POST /api/users/:userId/follow - Follow a user (protected)
router.post('/:userId/follow', authenticateToken, userController.followUser);

// DELETE /api/users/:userId/follow - Unfollow a user (protected)
router.delete('/:userId/follow', authenticateToken, userController.unfollowUser);

module.exports = router;