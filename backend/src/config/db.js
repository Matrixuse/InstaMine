
const crypto = require('crypto');




const MOCK_DB = {
    users: [],
    posts: [],
    follows: [],
    likes: [],
    comments: [],
};


const generateId = () => crypto.randomBytes(8).toString('hex');


const mockHash = (password) => crypto.createHash('sha256').update(password).digest('hex');
const mockCompare = (password, hash) => mockHash(password) === hash;


const initializeMockData = () => {

    const mockUser1 = { id: 'u1', username: 'gemini_dev', passwordHash: mockHash('pass123') };
    const mockUser2 = { id: 'u2', username: 'explorer_x', passwordHash: mockHash('pass123') };
    const mockUser3 = { id: 'u3', username: 'creative_cat', passwordHash: mockHash('pass123') };
    MOCK_DB.users.push(mockUser1, mockUser2, mockUser3);


    MOCK_DB.follows.push({ followerId: 'u1', followingId: 'u2' });
    MOCK_DB.follows.push({ followerId: 'u1', followingId: 'u3' });


    const p1 = { id: 'p1', userId: 'u2', imageUrl: 'https://placehold.co/600x400/007FFF/ffffff?text=Mountain+View', caption: 'A stunning mountain view!', timestamp: Date.now() - 100000 };
    const p2 = { id: 'p2', userId: 'u3', imageUrl: 'https://placehold.co/600x400/FF5733/ffffff?text=Coding+Session', caption: 'Late-night coding session.', timestamp: Date.now() - 50000 };
    const p3 = { id: 'p3', userId: 'u1', imageUrl: 'https://placehold.co/600x400/33FF57/000000?text=My+Own+Post', caption: 'Testing my own feed functionality.', timestamp: Date.now() };
    MOCK_DB.posts.push(p1, p2, p3);


    MOCK_DB.likes.push({ postId: 'p1', userId: 'u1' });
    MOCK_DB.likes.push({ postId: 'p2', userId: 'u1' });


    MOCK_DB.comments.push({ id: generateId(), postId: 'p1', userId: 'u3', text: 'Looks amazing!', timestamp: Date.now() - 90000 });

    console.log(`[DB] Mock Data Initialized. Test User: ${mockUser1.username}, Password: pass123`);
};


initializeMockData();


module.exports = {
    MOCK_DB,
    generateId,
    mockHash,
    mockCompare,
};