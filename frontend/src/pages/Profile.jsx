import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { formatDistanceToNow } from 'date-fns';
import './Profile.css';

const Profile = () => {
    const [userReports, setUserReports] = useState([]);
    const [message, setMessage] = useState('');
    const [points, setPoints] = useState(0);
    const [badges, setBadges] = useState([]);
    useEffect(() => {
        fetchReports();
        fetchProfileData();
    }, []);

    const fetchProfileData = () => {
        const token = localStorage.getItem('access');
        axios.get('https://swasthgram.onrender.com/api/profile/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setPoints(res.data.points);
                setBadges(res.data.badges);
            })
            .catch(err => console.error('Failed to fetch profile data:', err));
    };

    const fetchReports = () => {
        const token = localStorage.getItem('access');
        axios.get('https://swasthgram.onrender.com/api/reports/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const currentUser = localStorage.getItem('username');
                const filteredReports = res.data
                    .filter(report => report.username === currentUser)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setUserReports(filteredReports);
            })
            .catch(err => {
                setMessage('❌ Failed to fetch your reports.');
                console.error('Fetch user reports error:', err);
            });
    };

    const approveResolution = (id) => {
        const token = localStorage.getItem('access');
        axios.post(`https://swasthgram.onrender.com/api/reports/${id}/approve/`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert("✅ Resolution approved!");
                fetchReports();
            })
            .catch(err => {
                console.error('Approval Error:', err);
                alert("❌ Failed to approve resolution.");
            });
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('access');
        if (window.confirm('Are you sure you want to delete this report?')) {
            axios.delete(`https://swasthgram.onrender.com/api/reports/${id}/delete/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    setUserReports(prev => prev.filter(r => r.id !== id));
                    alert('✅ Report deleted!');
                })
                .catch(err => {
                    console.error('Delete error:', err);
                    alert('❌ Failed to delete report.');
                });
        }
    };

    return (
        <div className="container profile-page shadow">
            <h2 className="mb-3">👤 My Profile</h2>
            <p className="mb-4">Username: <strong>{localStorage.getItem('username')}</strong></p>

            <h4 className="mb-3">🧾 My Hygiene Reports</h4>
            {message && <p className="text-danger">{message}</p>}

            {userReports.length === 0 ? (
                <p className="text-muted">You haven’t submitted any reports yet.</p>
            ) : (
                <ul className="list-group mb-4">
                    {userReports.map((report, idx) => (
                        <li key={idx} className="list-group-item report-item">
                            <div>
                                <strong>📍 Issue:</strong> {report.issue_type.replace('_', ' ')}<br />
                                <strong>📝 Description:</strong> {report.description || 'N/A'}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className="text-muted">
                                    <strong>🕒</strong> {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                                </span>
                                <button
                                    className="btn btn-sm btn-outline-danger delete-btn"
                                    onClick={() => handleDelete(report.id)}
                                >
                                    🗑️
                                </button>
                            </div>

                            {report.file && (
                                <div className="mt-2">
                                    <strong>📎 Proof:</strong><br />
                                    <a href={`https://swasthgram.onrender.com${report.file}`} className="proof-link" target="_blank" rel="noreferrer">View Attachment</a>
                                </div>
                            )}

                            {report.resolution_submitted && !report.is_approved && (
                                <div className="alert alert-warning mt-3">
                                    <strong>📝 Resolution Submitted</strong><br />
                                    <a href={`https://swasthgram.onrender.com${report.resolution_proof}`} target="_blank" rel="noreferrer">View Resolution</a>
                                    <p className="mb-1">{report.resolution_description || 'No description provided.'}</p>
                                    <button className="btn btn-success btn-sm" onClick={() => approveResolution(report.id)}>✅ Approve</button>
                                </div>
                            )}

                            {report.is_resolved && report.is_approved && (
                                <div className="alert alert-success mt-3">✅ Resolution Approved!</div>
                            )}

                            {report.is_resolved && !report.is_approved && (
                                <div className="alert alert-info mt-3">⏳ Resolution Pending Approval</div>
                            )}

                            {!report.is_resolved && (
                                <div className="alert alert-secondary mt-3">🔄 Resolution Not Submitted Yet</div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <h4>🏆 Points Earned: <span className="text-primary">{points}</span></h4>

            {badges.length > 0 && (
                <div className="badge-section mt-4">
                    <h4 className="fw-bold mb-3">🎖️ Your Badges</h4>
                    <div className="d-flex flex-wrap gap-2">
                        {badges.map((badge, index) => (
                            <span key={index} className="badge custom-badge">{badge}</span>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;
