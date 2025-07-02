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
        axios.get('http://localhost:8000/api/profile/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setPoints(res.data.points);
                setBadges(res.data.badges);
            })
            .catch(err => {
                console.error('Failed to fetch profile data:', err);
            });
    };


    const fetchReports = () => {
        const token = localStorage.getItem('access');
        axios.get('http://localhost:8000/api/reports/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const currentUser = localStorage.getItem('username');
                const filteredReports = res.data
                    .filter(report => report.username === currentUser)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // 🔁 sort descending
                setUserReports(filteredReports);
            })
            .catch(err => {
                setMessage('❌ Failed to fetch your reports.');
                console.error('Fetch user reports error:', err);
            });
    };

    const approveResolution = (id) => {
        const token = localStorage.getItem('access');

        axios.post(`http://localhost:8000/api/reports/${id}/approve/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log("Approval Response ✅:", res);
                alert("✅ Resolution approved!");
                fetchReports(); // refresh list
            })
            .catch((err) => {
                console.error('Approval Error ❌:', err.response?.data || err.message);
                alert("❌ Failed to approve resolution.");
            });
    };


    const handleDelete = (id) => {
        const token = localStorage.getItem('access');
        if (window.confirm('Are you sure you want to delete this report?')) {
            axios.delete(`http://localhost:8000/api/reports/${id}/delete/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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
        <div className="profile-page">
            <h2>👤 My Profile</h2>
            <p>Username: <strong>{localStorage.getItem('username')}</strong></p>

            <h3>🧾 My Hygiene Reports</h3>
            {message && <p className="error">{message}</p>}

            {userReports.length === 0 ? (
                <p>You haven’t submitted any reports yet.</p>
            ) : (
                <ul className="report-list">
                    {userReports.map((report, idx) => (
                        <li key={idx} className="report-item">
                            <div>
                                <strong>📍 Issue:</strong> {report.issue_type.replace('_', ' ')}<br />
                                <strong>📝 Description:</strong> {report.description || 'N/A'}<br />
                            </div>

                            <div className="report-meta">
                                <span>
                                    <strong>🕒 Reported:</strong> {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                                </span>
                                <button
                                    onClick={() => handleDelete(report.id)}
                                    className="delete-btn"
                                    title="Delete Report"
                                >
                                    🗑️
                                </button>
                            </div>

                            {report.file && (
                                <div>
                                    <strong>📎 Proof:</strong><br />
                                    <a className='proof-link' href={`http://localhost:8000${report.file}`} target="_blank" rel="noreferrer">
                                        View Attachment
                                    </a>
                                </div>
                            )}

                            {report.is_resolved && report.resolution_proof && (
                                <div>
                                    <strong>🔧 Resolution Proof:</strong><br />
                                    <a href={`http://localhost:8000${report.resolution_proof}`} target="_blank" rel="noreferrer">
                                        View Resolution
                                    </a>
                                </div>
                            )}

                            {report.resolution_submitted && !report.is_approved && (
                                <div className="resolution-status">
                                    <strong>📝 Resolution Submitted </strong>
                                    <br></br>
                                    <a href={`http://localhost:8000${report.resolution_proof}`} target="_blank" rel="noreferrer">
                                        View Resolution
                                    </a>
                                    <p>{report.resolution_description || 'No description provided.'}</p>
                                    <button
                                        className="approve-btn"
                                        onClick={() => approveResolution(report.id)}
                                    >
                                        ✅ Approve Resolution
                                    </button>
                                </div>
                            )}
                            {report.is_resolved && !report.is_approved && (
                                <div className="resolution-pending">
                                    <strong>⏳ Resolution Pending Approval</strong>
                                </div>
                            )}

                            {!report.is_resolved && (
                                <div className="resolution-not-submitted">
                                    <strong>🔄 Resolution Not Submitted Yet</strong>
                                </div>
                            )}

                            {report.is_resolved && report.is_approved && (
                                <div className="resolution-approved">
                                    <strong>✅ Resolution Approved!</strong>
                                </div>
                            )
                            }
                        </li>

                    ))}
                </ul>
            )}
            <h2>🏆 Points Earned: <span style={{ color: '#007bff' }}>{points}</span></h2>

            {badges.length > 0 && (
                <div className="badge-section">
                    <h3>🎖️ Your Badges</h3>
                    <ul className="badge-list">
                        {badges.map((badge, index) => (
                            <li key={index}>{badge}</li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
};

export default Profile;
