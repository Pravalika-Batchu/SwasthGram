import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ Import for navigation
import './Auth.css';
import axios from '../axiosConfig';

const Login = ({ setToken }) => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // ⬅️ Hook to navigate

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
            localStorage.setItem('username', form.username); // ⬅️ Store username
            setToken(access);
            setMessage('✅ Login successful! Redirecting...');

            // Redirect after short delay
            setTimeout(() => {
                navigate('/profile'); // ⬅️ Redirect to Profile page
            }, 1000);
        } catch (err) {
            setMessage('❌ Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-form">
            <h3>🔐 Login</h3>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
