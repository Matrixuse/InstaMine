

const API_BASE_URL = 'http://localhost:3000/api';


const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {

                if (response.status >= 400 && response.status < 500) {
                     const errorData = await response.json().catch(() => ({ message: `Client error (${response.status})` }));
                     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                throw new Error(`Server error, status: ${response.status}`);
            }
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            const delay = Math.pow(2, i) * 1000;

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("API call failed after multiple retries.");
};



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

    login: (username, password) => fetchAuth('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    }),
    signup: (username, password) => fetchAuth('/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    }),


    getFeed: () => fetchAuth('/feed'),
    createPost: (imageUrl, caption) => fetchAuth('/posts', {
        method: 'POST',
        body: JSON.stringify({ imageUrl, caption })
    }),


    likePost: (postId) => fetchAuth(`/posts/${postId}/like`, { method: 'POST' }),
    unlikePost: (postId) => fetchAuth(`/posts/${postId}/like`, { method: 'DELETE' }),
    getComments: (postId) => fetchAuth(`/posts/${postId}/comments`),
    addComment: (postId, text) => fetchAuth(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text })
    }),


    getProfile: (userId) => fetchAuth(`/users/${userId}`),
    followUser: (userId) => fetchAuth(`/users/${userId}/follow`, { method: 'POST' }),
    unfollowUser: (userId) => fetchAuth(`/users/${userId}/follow`, { method: 'DELETE' }),
};