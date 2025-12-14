// src/components/posts/CommentSection.jsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { api } from '../../api/apiService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Button from '../ui/Button.jsx'; // Path is already correct (../)

/**
 * Displays comments and provides an input form for adding new comments.
 * @param {string} postId - The ID of the post being commented on.
 * @param {function} navigate - Function to navigate between views.
 * @param {Array<Object>} postComments - List of comments to display.
 * @param {function} refreshPostData - Callback to refresh the parent post's data after a new comment.
 */
const CommentSection = ({ postId, navigate, postComments, refreshPostData }) => {
    const { isAuthenticated } = useAuth();
    const [newCommentText, setNewCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim() || commentLoading) return;

        setCommentLoading(true);
        try {
            await api.addComment(postId, newCommentText);
            setNewCommentText('');
            refreshPostData(); // Trigger parent to re-fetch post data and comments
        } catch (e) {
            console.error('Failed to add comment:', e);
            // In a full app, display a custom error message here
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Comments Area (Scrollable) */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 max-h-80 lg:max-h-full">
                {postComments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center italic mt-4">Be the first to comment!</p>
                ) : (
                    postComments.map(comment => (
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

            {/* Comment Input */}
            {isAuthenticated && (
                <div className="p-3 border-t bg-white">
                    <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="flex-grow p-2 border border-gray-100 rounded-full focus:ring-2 focus:ring-indigo-200 text-sm"
                        />
                        <button type="submit" disabled={!newCommentText.trim() || commentLoading} className="px-3 py-2 rounded-full bg-indigo-600 text-white shadow-sm">
                            {commentLoading ? <Send size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CommentSection;