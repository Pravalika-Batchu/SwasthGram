import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

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
                <Link to="/">Home</Link>
                {token ? (
                    <>
                        <Link to="/report">Report</Link>
                        <button onClick={handleLogout}>Logout</button>
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
