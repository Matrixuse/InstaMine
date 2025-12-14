
const postModel = require('../models/postModel');
const followModel = require('../models/followModel');

const createPost = (req, res) => {
    const { imageUrl, caption } = req.body;
    const userId = req.userId;

    if (!imageUrl || !caption) {
        return res.status(400).json({ message: 'Image URL and caption are required' });
    }

    const newPost = postModel.createPost(userId, imageUrl, caption);
    res.status(201).json({ message: 'Post created', post: newPost });
};

const getFeed = (req, res) => {
    const currentUserId = req.userId;


    const followingIds = followModel.getFollowingIds(currentUserId);


    followingIds.push(currentUserId);


    const feedPosts = postModel.findPostsByUserIds(followingIds);


    const enrichedFeed = feedPosts.map(p => postModel.enrichPost(p, currentUserId));

    res.json(enrichedFeed);
};

const likePost = (req, res) => {
    const { postId } = req.params;
    const userId = req.userId;

    if (!postModel.findPostById(postId)) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (postModel.addLike(postId, userId)) {
        res.json({ message: 'Post liked successfully' });
    } else {
        res.status(400).json({ message: 'Post already liked' });
    }
};

const unlikePost = (req, res) => {
    const { postId } = req.params;
    const userId = req.userId;

    if (postModel.removeLike(postId, userId)) {
        res.json({ message: 'Post unliked successfully' });
    } else {
        res.status(404).json({ message: 'Like not found' });
    }
};

const getComments = (req, res) => {
    const { postId } = req.params;
    

    const enrichedComments = postModel.findCommentsByPostId(postId).map(c => {
        const commenter = require('../models/userModel').findUserById(c.userId);
        return {
            ...c,
            username: commenter ? commenter.username : '[Deleted User]'
        };
    });

    res.json(enrichedComments);
};

const addComment = (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    if (!postModel.findPostById(postId)) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    const newComment = postModel.addComment(postId, userId, text);
    res.status(201).json({ message: 'Comment added', comment: newComment });
};

module.exports = {
    createPost,
    getFeed,
    likePost,
    unlikePost,
    getComments,
    addComment,
};