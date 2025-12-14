
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');


router.get('/:userId', userController.getProfile);


router.post('/:userId/follow', authenticateToken, userController.followUser);


router.delete('/:userId/follow', authenticateToken, userController.unfollowUser);

module.exports = router;