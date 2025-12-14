
const userModel = require('../models/userModel');
const followModel = require('../models/followModel');
const postModel = require('../models/postModel');

const getProfile = (req, res) => {
    const { userId } = req.params;
    const authUserId = req.userId;

    const user = userModel.findUserById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const followersCount = followModel.getFollowerCount(userId);
    const followingCount = followModel.getFollowingCount(userId);
    

    const isFollowing = authUserId ? followModel.isFollowing(authUserId, userId) : false;

    const userPosts = postModel.findPostsByUserId(userId);
    

    const enrichedPosts = userPosts.map(p => postModel.enrichPost(p, authUserId));

    res.json({
        id: user.id,
        username: user.username,
        posts: enrichedPosts,
        followersCount,
        followingCount,
        isFollowing
    });
};

const followUser = (req, res) => {
    const followingId = req.params.userId;
    const followerId = req.userId;

    if (followerId === followingId) {
        return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    if (!userModel.findUserById(followingId)) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (followModel.addFollow(followerId, followingId)) {
        res.json({ message: 'User followed successfully' });
    } else {
        res.status(400).json({ message: 'Already following this user' });
    }
};

const unfollowUser = (req, res) => {
    const followingId = req.params.userId;
    const followerId = req.userId;

    if (followModel.removeFollow(followerId, followingId)) {
        res.json({ message: 'User unfollowed successfully' });
    } else {
        res.status(404).json({ message: 'Not currently following this user' });
    }
};

module.exports = {
    getProfile,
    followUser,
    unfollowUser,
};