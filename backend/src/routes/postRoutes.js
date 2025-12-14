// src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/posts - Create a new post (protected)
router.post('/', authenticateToken, postController.createPost);

// GET /api/feed - Fetch user's personalized feed (protected)
router.get('/feed', authenticateToken, postController.getFeed);

// POST /api/posts/:postId/like - Like a post (protected)
router.post('/:postId/like', authenticateToken, postController.likePost);

// DELETE /api/posts/:postId/like - Unlike a post (protected)
router.delete('/:postId/like', authenticateToken, postController.unlikePost);

// POST /api/posts/:postId/comments - Add a comment (protected)
router.post('/:postId/comments', authenticateToken, postController.addComment);

// GET /api/posts/:postId/comments - Get all comments for a post (public)
router.get('/:postId/comments', postController.getComments);

module.exports = router;