import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

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
        <div className="container mt-5">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <h3 className="text-center text-primary mb-4">🔐 Login</h3>
                    {message && <div className="alert alert-info text-center">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" name="username" id="username" value={form.username} onChange={handleChange} className="form-control" required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" name="password" id="password" value={form.password} onChange={handleChange} className="form-control" required />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
