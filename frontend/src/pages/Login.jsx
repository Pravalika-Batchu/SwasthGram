import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './Auth.css';

const Login = ({ setToken }) => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://swasthgram.onrender.com/api/auth/login/', form);
            const { access, refresh } = res.data;
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('username', form.username);
            setToken(access);
            setMessage('✅ Login successful! Redirecting...');
            setTimeout(() => navigate('/profile'), 1000);
        } catch (err) {
            setMessage('❌ Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="page-content">
            <div className="auth-page">
                <div className="bubble-background">
                    <div className="bubble bubble-1"></div>
                    <div className="bubble bubble-2"></div>
                    <div className="bubble bubble-3"></div>
                    <div className="bubble bubble-4"></div>
                    <div className="bubble bubble-5"></div>
                    <div className="bubble bubble-6"></div>
                </div>
                <div className="auth-card animate-card-pop">
                    <h3 className="auth-title">🔐 Login</h3>
                    {message && <div className="auth-message">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="form-control animate-input"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="form-control animate-input"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 animate-button">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
