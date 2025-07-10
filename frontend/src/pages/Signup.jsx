import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './Auth.css';

const Signup = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setMessage('❌ Passwords do not match');
            return;
        }

        try {
            const { username, password } = form;
            const res = await axios.post('https://swasthgram.onrender.com/api/auth/register/', { username, password });
            setMessage(res.data.message || '✅ Signup successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1000);
        } catch (err) {
            setMessage(err.response?.data?.error || '❌ Signup failed');
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
                    <h3 className="auth-title">👤 Create Account</h3>
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

                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="form-control animate-input"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 animate-button">Signup</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
