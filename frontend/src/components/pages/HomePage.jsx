
import React, { useState, useEffect, useCallback } from 'react';
import { Loader, PlusSquare } from 'lucide-react';
import { api } from '../../api/apiService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import PostCard from '../posts/PostCard.jsx';


const HomePage = ({ navigate }) => {
    const { token } = useAuth();
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFeed = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getFeed();
            setFeed(data || []);
        } catch (e) {
            setError(e.message || 'Failed to load feed. Ensure backend is running.');
            setFeed([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);


    const suggestions = [
        { id: 'explorer_x', name: 'explorer_x' },
        { id: 'creative_cat', name: 'creative_cat' },
        { id: 'gemini_dev', name: 'gemini_dev' },
    ];

    return (
        <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Your Feed</h2>
                <button onClick={() => navigate('create')} className="px-3 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md flex items-center">
                    <PlusSquare size={16} className="mr-2" /> New Post
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {[1,2,3].map(n => (
                            <div key={n} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 animate-pulse h-56" />
                        ))}
                    </div>
                    <aside className="hidden lg:block">
                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                            <p className="font-semibold mb-2">Suggestions</p>
                            <p className="text-sm text-gray-500">Loading...</p>
                        </div>
                    </aside>
                </div>
            ) : error ? (
                <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">Error: {error}</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {feed.length === 0 ? (
                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 text-center">
                                <h3 className="text-xl font-semibold mb-2">Your Feed is Empty</h3>
                                <p className="text-sm text-gray-500 mb-4">Start by following a few users or create your first post.</p>
                                <button onClick={() => navigate('create')} className="px-4 py-2 rounded-full bg-indigo-600 text-white shadow">Create Post</button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {feed.map(post => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        navigate={navigate}
                                        refreshFeed={fetchFeed}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="hidden lg:block">
                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 mb-4">
                            <p className="font-semibold mb-2">Suggestions to follow</p>
                            <div className="space-y-3">
                                {suggestions.map(s => (
                                    <div key={s.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center mr-3">{s.name.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <p className="text-sm font-medium">{s.name}</p>
                                                <p className="text-xs text-gray-400">Suggested for you</p>
                                            </div>
                                        </div>
                                        <button onClick={() => alert('Follow feature coming soon')} className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-full">Follow</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                            <p className="text-sm text-gray-500">Tip: Click a post to view comments and interact.</p>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default HomePage;