
const { MOCK_DB } = require('../config/db');



const getFollowerCount = (userId) => {
    return MOCK_DB.follows.filter(f => f.followingId === userId).length;
};

const getFollowingCount = (userId) => {
    return MOCK_DB.follows.filter(f => f.followerId === userId).length;
};

const isFollowing = (followerId, followingId) => {
    return MOCK_DB.follows.some(f => f.followerId === followerId && f.followingId === followingId);
};

const addFollow = (followerId, followingId) => {
    if (!isFollowing(followerId, followingId)) {
        MOCK_DB.follows.push({ followerId, followingId });
        return true;
    }
    return false;
};

const removeFollow = (followerId, followingId) => {
    const initialLength = MOCK_DB.follows.length;
    MOCK_DB.follows = MOCK_DB.follows.filter(f => !(f.followerId === followerId && f.followingId === followingId));
    return MOCK_DB.follows.length < initialLength;
};

const getFollowingIds = (userId) => {
    return MOCK_DB.follows.filter(f => f.followerId === userId).map(f => f.followingId);
}

module.exports = {
    getFollowerCount,
    getFollowingCount,
    isFollowing,
    addFollow,
    removeFollow,
    getFollowingIds,
};