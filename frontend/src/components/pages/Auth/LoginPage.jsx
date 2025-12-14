import React, { useState } from 'react';
import { api } from '../../../api/apiService.js';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { Loader } from 'lucide-react';

const LoginPage = ({ navigate }) => {
    const { handleLoginSuccess } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await api.login(username, password);
            handleLoginSuccess(data.token, data.userId, data.username);
            navigate('feed');
        } catch (err) {
            setError(err.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card card">
            <h2>Log In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="auth-input"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password (must be atleast 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? <Loader size={18} className="animate-spin" /> : 'Log In'}
                </button>
            </form>
            <div className="auth-footer">Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate('signup')}>Sign Up</span></div>
        </div>
    );
};

export default LoginPage;