
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');


router.post('/', authenticateToken, postController.createPost);


router.get('/feed', authenticateToken, postController.getFeed);


router.post('/:postId/like', authenticateToken, postController.likePost);


router.delete('/:postId/like', authenticateToken, postController.unlikePost);


router.post('/:postId/comments', authenticateToken, postController.addComment);


router.get('/:postId/comments', postController.getComments);

module.exports = router;