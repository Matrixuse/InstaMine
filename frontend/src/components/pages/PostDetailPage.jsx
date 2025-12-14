// src/pages/PostDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Loader, Send } from 'lucide-react';
import { api } from '../../api/apiService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const PostDetailPage = ({ navigate, postId }) => {
    const { token } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPostAndComments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Re-fetch the entire feed to get updated post data (simplification)
            const feed = await api.getFeed();
            const targetPost = feed.find(p => p.id === postId);

            if (!targetPost) throw new Error('Post not found in feed.');

            setPost(targetPost);
            const commentData = await api.getComments(postId);
            setComments(commentData);
        } catch (e) {
            setError(e.message || 'Failed to load post details.');
        } finally {
            setLoading(false);
        }
    }, [postId, token]);

    useEffect(() => {
        fetchPostAndComments();
    }, [fetchPostAndComments]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            await api.addComment(postId, newCommentText);
            setNewCommentText('');
            await fetchPostAndComments();
        } catch (e) {
            console.error('Failed to add comment:', e);
            // Use custom modal for error display in production
        }
    };

    if (loading && !post) {
        return <div className="flex justify-center items-center h-64"><Loader size={36} className="animate-spin text-blue-500" /></div>;
    }

    if (error) {
        return <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">Error: {error}</div>;
    }

    const handleLike = async () => {
        try {
            if (post.isLiked) await api.unlikePost(postId);
            else await api.likePost(postId);
            fetchPostAndComments(); // Refresh post status
        } catch (e) {
            console.error('Like toggle failed:', e);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Post Content */}
                <div className="lg:col-span-3 aspect-square bg-gray-100 overflow-hidden">
                    <img
                        src={post.imageUrl}
                        alt={post.caption}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/800x600/FF0000/ffffff?text=Image+Load+Error'; }}
                    />
                </div>

                {/* Comments and Details */}
                <div className="lg:col-span-2 flex flex-col h-full">
                    {/* Post Header & Caption */}
                    <div className="p-4 border-b">
                        <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-md font-bold text-gray-700 mr-2">
                                {post.username.charAt(0).toUpperCase()}
                            </div>
                            <p
                                className="font-bold text-gray-800 cursor-pointer hover:text-blue-500"
                                onClick={() => navigate('profile', post.userId)}
                            >
                                {post.username}
                            </p>
                        </div>
                        <p className="text-gray-700 text-sm">{post.caption}</p>
                    </div>

                    {/* Comments Area (Scrollable) */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-3 max-h-80 lg:max-h-full">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center italic mt-4">Be the first to comment!</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="text-sm">
                                    <span
                                        className="font-semibold cursor-pointer hover:text-blue-500 mr-1"
                                        onClick={() => navigate('profile', comment.userId)}
                                    >
                                        {comment.username}
                                    </span>
                                    <span className="text-gray-700">{comment.text}</span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer - Likes & Comment Input */}
                    <div className="p-4 border-t">
                        {/* Interactive Like/Comment UI */}
                        <div className="flex items-center mb-3 space-x-4">
                            <button
                                onClick={handleLike}
                                className={`transition duration-150 transform hover:scale-110 flex items-center ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                            >
                                <Heart size={24} fill={post.isLiked ? 'currentColor' : 'none'} />
                            </button>
                            <span className="font-semibold text-gray-800">{post.likesCount} likes</span>
                        </div>

                        {/* Comment Input */}
                        <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                className="flex-grow p-2 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <button
                                type="submit"
                                className="p-2 text-blue-500 hover:text-blue-700 transition"
                                disabled={!newCommentText.trim()}
                            >
                                <Send size={24} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;