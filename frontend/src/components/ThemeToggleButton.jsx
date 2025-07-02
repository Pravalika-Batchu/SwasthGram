import React, { useEffect, useState } from 'react';
import './ThemeToggleButton.css';

const ThemeToggleButton = () => {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        document.body.className = darkMode ? 'dark' : 'light';
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <label className="theme-switch">
            <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
            <span className="slider">
                <span className="icon">{darkMode ? '☀️' : '🌙'}</span>
            </span>
        </label>
    );
};

export default ThemeToggleButton;
