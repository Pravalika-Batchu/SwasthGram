import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Signup = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState('');

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
            const res = await axios.post('http://localhost:8000/api/auth/register/', { username, password });
            setMessage(res.data.message || '✅ Signup successful');
        } catch (err) {
            setMessage(err.response?.data?.error || '❌ Signup failed');
        }
    };

    return (
        <div className="auth-form">
            <h3>👤 Create Account</h3>
            {message && <div className="login-message">{message}</div>}

            <form onSubmit={handleSubmit} className="auth-form-fields">
                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
