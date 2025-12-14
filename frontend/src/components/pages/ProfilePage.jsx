// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { api } from '../../api/apiService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ProfilePage = ({ navigate, profileUserId }) => {
    const { userId: currentUserId, token } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isOwner = currentUserId === profileUserId;

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Need to pass token header for the mock backend to determine isFollowing status
            const data = await api.getProfile(profileUserId);
            setProfileData(data);
        } catch (e) {
            setError(e.message || 'Failed to load profile.');
            setProfileData(null);
        } finally {
            setLoading(false);
        }
    }, [profileUserId, token]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleFollowToggle = async () => {
        if (!profileData) return;
        setLoading(true);
        try {
            if (profileData.isFollowing) {
                await api.unfollowUser(profileUserId);
            } else {
                await api.followUser(profileUserId);
            }
            // Re-fetch profile to update follow status and counts
            await fetchProfile();
        } catch (e) {
            console.error('Follow toggle failed:', e);
            setLoading(false);
        }
    };

    if (loading && !profileData) {
        return <div className="flex justify-center items-center h-64"><Loader size={36} className="animate-spin text-blue-500" /></div>;
    }

    if (error || !profileData) {
        return <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">Error: {error}</div>;
    }

    return (
        <div className="app-shell">
            <div className="card p-6 mb-6 text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-blue-400 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-3">
                    {profileData.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">{profileData.username}</h2>

                <div className="flex justify-center space-x-12 mt-4 mb-4">
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-800">{profileData.posts.length}</p>
                        <p className="text-sm muted">Posts</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-800">{profileData.followersCount}</p>
                        <p className="text-sm muted">Followers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-800">{profileData.followingCount}</p>
                        <p className="text-sm muted">Following</p>
                    </div>
                </div>

                {!isOwner && (
                    <button
                        onClick={handleFollowToggle}
                        className={`px-5 py-2 font-semibold rounded-full transition duration-200 shadow-md ${profileData.isFollowing
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            : 'bg-indigo-600 text-white hover:opacity-95'
                        }`}
                        disabled={loading}
                    >
                        {loading ? <Loader size={16} className="animate-spin inline-block mr-2" /> : profileData.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profileData.posts.length > 0 ? (
                    profileData.posts.map(post => (
                        <div key={post.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition duration-300 transform hover:scale-[1.01]" onClick={() => navigate('post', post.id)}>
                            <img
                                src={post.imageUrl}
                                alt={post.caption}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://placehold.co/300x300/FF0000/ffffff?text=Image+Load+Error'; }}
                            />
                        </div>
                    ))
                ) : (
                    <div className="md:col-span-3 text-center py-10 muted">
                        No posts yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;