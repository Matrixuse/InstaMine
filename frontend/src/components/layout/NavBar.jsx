// src/components/layout/NavBar.jsx
import React from 'react';
import { PlusSquare, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx'; // Imports authentication state

const NavBar = ({ navigate }) => {
    // Get authentication state and functions from context
    const { isAuthenticated, userId, logout } = useAuth();

    return (
        <header className="topbar">
            <div className="app-shell">
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div className="brand" onClick={() => navigate('feed')} style={{cursor:'pointer'}}>MiniInsta</div>
                </div>
                <nav className="nav-actions">
                    {isAuthenticated ? (
                        // Navigation links for authenticated users
                        <>
                            <button onClick={() => navigate('feed')} className="text-gray-600 hover:text-blue-500 transition duration-150" aria-label="Home Feed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            </button>
                            <button onClick={() => navigate('create')} className="text-gray-600 hover:text-blue-500 transition duration-150" aria-label="Create Post">
                                <PlusSquare size={24} />
                            </button>
                            {/* Link to the current user's profile */}
                            <button onClick={() => navigate('profile', userId)} className="text-gray-600 hover:text-blue-500 transition duration-150" aria-label="User Profile">
                                <User size={24} />
                            </button>
                            {/* Logout button */}
                            <button onClick={() => { logout(); navigate('login'); }} className="text-red-500 hover:text-red-700 transition duration-150 p-1 rounded-full bg-red-50" aria-label="Log Out">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        // Navigation links for logged-out users
                        <>
                            <button onClick={() => navigate('login')} className="" style={{background:'transparent',border:'0',color:'#2563eb',display:'flex',alignItems:'center',gap:6}}>
                                <LogIn size={18} /> Log In
                            </button>
                            <button onClick={() => navigate('signup')} className="" style={{background:'transparent',border:'0',color:'#e5e9efff'}}>Sign Up</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default NavBar;