// src/api/apiService.js

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Helper function to handle fetch calls with exponential backoff (for robust API usage).
 */
const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                // Throw specific error for client issues (4xx) to stop retries
                if (response.status >= 400 && response.status < 500) {
                     const errorData = await response.json().catch(() => ({ message: `Client error (${response.status})` }));
                     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                // Retry for server errors (5xx)
                throw new Error(`Server error, status: ${response.status}`);
            }
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            const delay = Math.pow(2, i) * 1000;
            // console.warn(`Fetch failed. Retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("API call failed after multiple retries.");
};


/**
 * Generic Fetch Wrapper that includes Authorization header if a token exists.
 */
const fetchAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };
    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    return response.json();
};


export const api = {
    // --- Auth Calls ---
    login: (username, password) => fetchAuth('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    }),
    signup: (username, password) => fetchAuth('/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    }),

    // --- Post Calls ---
    getFeed: () => fetchAuth('/feed'),
    createPost: (imageUrl, caption) => fetchAuth('/posts', {
        method: 'POST',
        body: JSON.stringify({ imageUrl, caption })
    }),

    // --- Like/Comment Calls ---
    likePost: (postId) => fetchAuth(`/posts/${postId}/like`, { method: 'POST' }),
    unlikePost: (postId) => fetchAuth(`/posts/${postId}/like`, { method: 'DELETE' }),
    getComments: (postId) => fetchAuth(`/posts/${postId}/comments`),
    addComment: (postId, text) => fetchAuth(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text })
    }),

    // --- User & Follow Calls ---
    getProfile: (userId) => fetchAuth(`/users/${userId}`),
    followUser: (userId) => fetchAuth(`/users/${userId}/follow`, { method: 'POST' }),
    unfollowUser: (userId) => fetchAuth(`/users/${userId}/follow`, { method: 'DELETE' }),
};