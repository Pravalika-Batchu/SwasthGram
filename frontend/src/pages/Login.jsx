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
            const res = await axios.post('http://localhost:8000/api/auth/login/', form);
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
        <div className="auth-page">
            <div className="auth-card">
                <h3 className="auth-title">🔐 Login</h3>
                {message && <div className="auth-message">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" name="username" value={form.username} onChange={handleChange} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
