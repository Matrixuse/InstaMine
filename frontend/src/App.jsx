import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import NavBar from './components/layout/NavBar.jsx';
import LoginPage from './components/pages/Auth/LoginPage.jsx';
import SignupPage from './components/pages/Auth/SignupPage.jsx';
import HomePage from './components/pages/HomePage.jsx';
import CreatePost from './components/pages/CreatePost.jsx';
import ProfilePage from './components/pages/ProfilePage.jsx';
import PostDetailPage from './components/pages/PostDetailPage.jsx';


const AppRouter = () => {
    const { isAuthenticated, userId } = useAuth();

    const [currentView, setCurrentView] = useState(isAuthenticated ? 'feed' : 'login');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedProfileId, setSelectedProfileId] = useState(null);

    const navigate = (view, data = null) => {
        setCurrentView(view);
        setSelectedPostId(view === 'post' ? data : null);
        setSelectedProfileId(view === 'profile' ? data : null);
    };


    const renderView = () => {
        let ComponentToRender = null;
        let props = { navigate };

        if (!isAuthenticated) {
            ComponentToRender = currentView === 'signup' ? SignupPage : LoginPage;
        } else {
            switch (currentView) {
                case 'feed':
                    ComponentToRender = HomePage;
                    break;
                case 'create':
                    ComponentToRender = CreatePost;
                    break;
                case 'profile':
                    ComponentToRender = ProfilePage;
                    props.profileUserId = selectedProfileId || userId;
                    break;
                case 'post':
                    ComponentToRender = PostDetailPage;
                    props.postId = selectedPostId;
                    break;
                case 'login':
                    ComponentToRender = LoginPage;
                    break;
                default:
                    ComponentToRender = HomePage;
            }
        }
        

        if (!ComponentToRender || typeof ComponentToRender !== 'function') {
            console.error("Critical Error: Component to render is undefined or not a function:", ComponentToRender);

            return <div className="text-center p-8 text-red-600 font-bold">Error loading application view. Please check component imports.</div>;
        }

        return <ComponentToRender {...props} />;
    };

    return (
        <div className="min-h-screen flex flex-col antialiased">
            <NavBar navigate={navigate} />
            <main className="flex-grow p-6 pt-20 app-shell">
                {renderView()}
            </main>
        </div>
    );
};


const App = () => (
    <AuthProvider>
        <AppRouter />
    </AuthProvider>
);

export default App;