import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './ResolveForm.css'; // Optional for dark styles

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

        axios.post(`https://swasthgram.onrender.com/api/reports/${reportId}/resolve/`, formData, {
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
        <div className="container mt-5 pt-4">
            <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
                <h2 className="text-primary mb-4 text-center">🧩 Solve Hygiene Issue</h2>
                <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="mb-3">
                        <label className="form-label fw-semibold">📎 Upload Proof</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">📝 Description (optional)</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a short note about how you resolved the issue..."
                        />
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-success px-4 py-2">Submit ✅</button>
                    </div>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default ResolveForm;
