// src/pages/ResolveForm.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
// import './ResolveForm.css';

const ResolveForm = () => {
    const { id: reportId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access');

        if (!file) {
            setError("Please upload proof (image, video, or PDF).");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);

        axios.post(`http://localhost:8000/api/reports/${reportId}/resolve/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert("✅ Resolution sent for approval!");
                navigate('/resolve');
            })
            .catch((err) => {
                console.error('Resolution Error:', err.response?.data || err.message);
                setError("❌ Failed to send the resolution for approval. Please try again.");
            });
    };

    return (
        <div className="resolve-form">
            <h2>🧩 Solve Hygiene Issue</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    📎 Upload Proof
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                </label>
                <label>
                    📝 Description (optional)
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <button type="submit">Submit ✅</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default ResolveForm;
