import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/reports/')
            .then(res => setReports(res.data))
            .catch(err => console.error('Error fetching reports:', err));
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-success">📋 All Hygiene Reports</h3>
            {reports.length === 0 ? (
                <p className="text-muted">No reports available yet.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-success">
                            <tr>
                                <th>#</th>
                                <th>Issue</th>
                                <th>Description</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Reported Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{report.issue_type.replace('_', ' ')}</td>
                                    <td>{report.description || 'N/A'}</td>
                                    <td>{report.latitude}</td>
                                    <td>{report.longitude}</td>
                                    <td>{new Date(report.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reports;
