
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { api } from '../../api/apiService.js';

const CreatePost = ({ navigate }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!imageUrl.trim() || !caption.trim()) {
            setError('Both image URL and caption are required.');
            setLoading(false);
            return;
        }

        try {
            await api.createPost(imageUrl, caption);
            navigate('feed');
        } catch (e) {
            setError(e.message || 'Failed to create post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-shell">
            <div className="card max-w-2xl mx-auto p-6 mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create a New Post</h2>
                <p className="muted mb-4">Share a photo and a caption with your followers.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                        type="url"
                        placeholder="Paste image link here (e.g., from placehold.co)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                    <textarea
                        placeholder="What's on your mind?"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                        required
                    />
                </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate('feed')}
                            className="px-4 py-2 rounded-md border bg-white shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-auto px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md"
                            disabled={loading}
                        >
                            {loading ? <Loader size={16} className="animate-spin" /> : 'Publish'}
                        </button>
                    </div>
            </form>
            </div>
        </div>
    );
};

export default CreatePost;