
import React, { useState } from 'react';
import { Heart, MessageSquare, Loader } from 'lucide-react';
import { api } from '../../api/apiService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const PostCard = React.memo(({ post, navigate, refreshFeed }) => {
    const { userId: currentUserId } = useAuth();
    const { id, username, imageUrl, caption, likesCount, commentsCount, isLiked, userId, timestamp } = post;
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (loading) return;
        setLoading(true);
        try {
            if (isLiked) {
                await api.unlikePost(id);
            } else {
                await api.likePost(id);
            }
            refreshFeed();
        } catch (e) {
            console.error('Like toggle failed:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6 transition-all duration-300 hover:shadow-md overflow-hidden">
            {}
            <div className="flex items-center p-4 border-b">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-700 mr-3">
                    {username.charAt(0).toUpperCase()}
                </div>
                <p
                    className="font-semibold text-gray-800 cursor-pointer hover:text-blue-500 transition"
                    onClick={() => navigate('profile', userId)}
                >
                    {username}
                </p>
            </div>

            {}
            <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={caption}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400/FF0000/ffffff?text=Image+Load+Error'; }}
                />
            </div>

            {}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLike}
                        className={`transition duration-150 transform hover:scale-110 flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                        disabled={loading}
                    >
                        {loading ? <Loader size={24} className="animate-spin" /> : (
                            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                        )}
                        <span className="ml-1 text-sm font-medium">{likesCount}</span>
                    </button>
                    <button
                        onClick={() => navigate('post', id)}
                        className="text-gray-500 hover:text-blue-500 transition duration-150 transform hover:scale-110 flex items-center"
                    >
                        <MessageSquare size={24} />
                        <span className="ml-1 text-sm font-medium">{commentsCount}</span>
                    </button>
                </div>
                <p className="text-xs text-gray-400">{timeAgo(timestamp)}</p>
            </div>

            {}
            <div className="p-4 pt-0 border-t bg-white">
                <p className="text-gray-700">
                    <span
                        className="font-semibold cursor-pointer hover:text-blue-500 transition mr-1"
                        onClick={() => navigate('profile', userId)}
                    >
                        {username}
                    </span>
                    {caption}
                </p>
            </div>
        </div>
    );
});

export default PostCard;