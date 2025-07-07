// src/pages/ResolveList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import './RList.css';

const ResolveList = () => {
    const [issues, setIssues] = useState([]);
    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        const token = localStorage.getItem('access');
        axios.get('http://localhost:8000/api/reports/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const unresolved = res.data.filter(report =>
                    !report.is_resolved &&
                    !report.is_approved &&
                    report.username !== currentUser
                );
                setIssues(unresolved);
            })
            .catch(err => console.error('Error loading issues:', err));
    }, [currentUser]);

    return (
        <div className="container resolveList-container">
            <h2 className='text-center resolve-title'>🧰 Unresolved Hygiene Issues</h2>
            {issues.length === 0 ? (
                <p className="text-center text-muted">🎉 All reported issues are resolved!</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover resolveList-table">
                        <thead className="table-dark">
                            <tr>
                                <th>Issue</th>
                                <th>Description</th>
                                <th>Reported By</th>
                                <th>Location</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map((issue, index) => (
                                <tr key={index}>
                                    <td>{issue.issue_type.replace('_', ' ')}</td>
                                    <td>{issue.description || 'N/A'}</td>
                                    <td>{issue.username}</td>
                                    <td>{`${issue.latitude}, ${issue.longitude}`}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            disabled={issue.resolution_submitted}
                                            onClick={() => window.location.href = `/resolve/${issue.id}`}
                                        >
                                            {issue.resolution_submitted ? '⏳ Pending Approval' : 'Solve 🛠️'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ResolveList;
