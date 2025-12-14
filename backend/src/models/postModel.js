
const { MOCK_DB, generateId } = require('../config/db');
const userModel = require('./userModel');


const createPost = (userId, imageUrl, caption) => {
    const newPost = {
        id: generateId(),
        userId,
        imageUrl,
        caption,
        timestamp: Date.now()
    };
    MOCK_DB.posts.push(newPost);
    return newPost;
};

const findPostById = (postId) => {
    return MOCK_DB.posts.find(p => p.id === postId);
};

const findPostsByUserIds = (userIds) => {
    return MOCK_DB.posts
        .filter(p => userIds.includes(p.userId))
        .sort((a, b) => b.timestamp - a.timestamp);
};

const findPostsByUserId = (userId) => {
    return MOCK_DB.posts
        .filter(p => p.userId === userId)
        .sort((a, b) => b.timestamp - a.timestamp);
}


const findLikesByPostId = (postId) => {
    return MOCK_DB.likes.filter(l => l.postId === postId);
};

const isPostLikedByUser = (postId, userId) => {
    return MOCK_DB.likes.some(l => l.postId === postId && l.userId === userId);
};

const addLike = (postId, userId) => {
    if (!isPostLikedByUser(postId, userId)) {
        MOCK_DB.likes.push({ postId, userId });
        return true;
    }
    return false;
};

const removeLike = (postId, userId) => {
    const initialLength = MOCK_DB.likes.length;
    MOCK_DB.likes = MOCK_DB.likes.filter(l => !(l.postId === postId && l.userId === userId));
    return MOCK_DB.likes.length < initialLength;
};


const findCommentsByPostId = (postId) => {
    return MOCK_DB.comments
        .filter(c => c.postId === postId)
        .sort((a, b) => a.timestamp - b.timestamp);
};

const addComment = (postId, userId, text) => {
    const newComment = {
        id: generateId(),
        postId,
        userId,
        text,
        timestamp: Date.now()
    };
    MOCK_DB.comments.push(newComment);
    return newComment;
};


const enrichPost = (post, currentUserId) => {
    const user = userModel.findUserById(post.userId);
    const postLikes = findLikesByPostId(post.id);
    const postComments = findCommentsByPostId(post.id);

    return {
        ...post,
        username: user ? user.username : '[Deleted User]',
        likesCount: postLikes.length,
        commentsCount: postComments.length,
        isLiked: currentUserId ? isPostLikedByUser(post.id, currentUserId) : false,
    };
};

module.exports = {
    createPost,
    findPostById,
    findPostsByUserIds,
    findPostsByUserId,
    findLikesByPostId,
    isPostLikedByUser,
    addLike,
    removeLike,
    findCommentsByPostId,
    addComment,
    enrichPost,
};