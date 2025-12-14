// src/pages/Auth/SignupPage.jsx
import React, { useState } from 'react';
import { api } from '../../../api/apiService.js';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { Loader } from 'lucide-react';

const SignupPage = ({ navigate }) => {
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
            await api.signup(username, password);
            // Auto-login after successful signup
            const data = await api.login(username, password);
            handleLoginSuccess(data.token, data.userId, data.username);
            navigate('feed');
        } catch (err) {
            setError(err.message || 'Signup failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card card">
            <h2>Sign Up</h2>
            <p className="muted">Join InstaMine</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Username, Email, Mobile No"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="auth-input"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    className="btn btn-success w-full"
                    disabled={loading}
                >
                    {loading ? <Loader size={18} className="animate-spin" /> : 'Create Account'}
                </button>
            </form>
            <div className="auth-footer">Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate('login')}>Log In</span></div>
        </div>
    );
};

export default SignupPage;