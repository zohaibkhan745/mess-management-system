import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <header className="dashboard-header">
            <div className="logo">
                <img src={process.env.PUBLIC_URL + '/assets/logo-pic.png'} alt="Logo" className="logo-img" />
                <span>Giki Mess Management System</span>
            </div>
            <nav className="dashboard-nav">
                <ul>
                    <li><a href="#about">about</a></li>
                    <li><a href="#pricing">pricing</a></li>
                    <li><a href="#contact">contact</a></li>
                    <li><Link to="/profile">profile</Link></li>
                </ul>
            </nav>
            <div className="navbar-actions">
                <div className="user-welcome">
                    {currentUser && `Welcome, ${currentUser.fname} ${currentUser.lname}`}
                </div>
                <div className="profile-icon">
                    <Link to="/profile" className="avatar-link">
                        <div className="avatar">{currentUser?.fname?.charAt(0) || 'U'}</div>
                    </Link>
                </div>
                {currentUser && (
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
