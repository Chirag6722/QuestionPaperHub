import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/auth';

const Navbar = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.png" alt="Logo" style={{ height: '40px', width: '40px', objectFit: 'contain' }} />
                    <span>Question Paper Hub</span>
                </Link>
                <div className="navbar-links">
                    {currentUser ? (
                        <>
                            <Link to="/upload" className="btn btn-outline">Upload Paper</Link>
                            <Link to="/my-uploads" className="btn btn-outline">My Uploads</Link>
                            <button onClick={handleLogout} className="btn btn-primary">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="btn btn-outline">Sign Up</Link>
                            <Link to="/login" className="btn btn-primary">Login</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
