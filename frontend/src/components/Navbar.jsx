import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import ThemeToggleButton from './ThemeToggleButton';


const Navbar = ({ token, setToken }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access');
        setToken(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <span className="logo">🧼 SwasthGram</span>
            <div className="links">
                <ThemeToggleButton />
                <Link to="/">Home</Link>
                {token ? (
                    <>
                        <Link to="/report">Report</Link>
                        <Link to="/resolve" >Resolve</Link>
                        <Link to="/leaderboard">Leaderboard</Link>
                        <Link to="/ask-ai">Ask AI</Link>
                        <Link to="/reports">All Reports</Link>
                        <Link to="/profile">Profile</Link>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
