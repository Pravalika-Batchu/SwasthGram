import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Uses JWT + baseURL
import { getGeminiSeverity } from '../utils/openRouterHelper';
import './RList.css'; // Custom styles for reports page
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [csvLoading, setCsvLoading] = useState(false);
    const [severities, setSeverities] = useState({});

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('access');
                const res = await axios.get('http://localhost:8000/api/reports/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setReports(res.data);

                // Fetch AI severity for each
                const severityMap = {};
                for (const r of res.data) {
                    const key = `${r.id}`;
                    severityMap[key] = await getGeminiSeverity(r.issue_type, r.description);
                }
                setSeverities(severityMap);
            } catch (err) {
                console.error('Failed to load reports:', err);
                alert('⚠️ Could not load reports. Are you logged in?');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleDownloadCSV = () => {
        setCsvLoading(true);
        const headers = ['Issue', 'Description', 'Latitude', 'Longitude', 'Reported Date', 'Severity'];
        const rows = reports.map((r) => [
            r.issue_type.replace('_', ' '),
            r.description || 'N/A',
            r.latitude,
            r.longitude,
            new Date(r.created_at).toLocaleString(),
            severities[`${r.id}`]?.toUpperCase() || 'N/A'
        ]);

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers, ...rows].map(row => row.join(',')).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'hygiene_reports.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setCsvLoading(false);
    };
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('SwasthGram – Hygiene Reports Summary', 14, 20);

        const headers = [['#', 'Issue', 'Description', 'Lat', 'Lng', 'Reported', 'Severity']];
        const data = reports.map((r, i) => [
            i + 1,
            r.issue_type.replace('_', ' '),
            r.description || 'N/A',
            r.latitude,
            r.longitude,
            new Date(r.created_at).toLocaleString(),
            severities[`${r.id}`]?.toUpperCase() || 'N/A'
        ]);

        autoTable(doc, {
            head: headers,
            body: data,
            startY: 30,
            theme: 'grid',
            styles: {
                fontSize: 9,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [46, 204, 113],
                textColor: 20,
                halign: 'center'
            },
            bodyStyles: {
                halign: 'center'
            }
        });

        doc.save('hygiene_reports.pdf');
    };


    return (
        <div className="container report-wrapper">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="reports-title">📋 Community Hygiene Reports</h3>
                <div className="download-buttons">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleDownloadCSV}
                        disabled={csvLoading}
                    >
                        🧾 {csvLoading ? 'Preparing...' : 'Download CSV'}
                    </button>
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleDownloadPDF}
                    >
                        🖨️ Download PDF
                    </button>

                </div>
            </div>


            {loading ? (
                <p className="load-text">⏳ Loading reports...</p>
            ) : reports.length === 0 ? (
                <p className="load-text">No reports available.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table custom-table table-bordered table-striped table-hover">

                        <thead className="table-success">
                            <tr>
                                <th>#</th>
                                <th>Issue</th>
                                <th>Description</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Reported</th>
                                <th>🧠 Severity</th>
                                <th>📎 Proof</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => {
                                const fileUrl = `http://localhost:8000${report.file}`;
                                const isImage = /\.(jpg|jpeg|png|gif)$/i.test(report.file || '');
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{report.issue_type.replace('_', ' ')}</td>
                                        <td>{report.description || 'N/A'}</td>
                                        <td>{report.latitude}</td>
                                        <td>{report.longitude}</td>
                                        <td>{new Date(report.created_at).toLocaleString()}</td>
                                        <td>
                                            {severities[`${report.id}`] === 'high' && '🔴 HIGH'}
                                            {severities[`${report.id}`] === 'medium' && '🟠 MEDIUM'}
                                            {severities[`${report.id}`] === 'low' && '🟢 LOW'}
                                            {!severities[`${report.id}`] && '⏳ ...'}
                                        </td>
                                        <td>
                                            {report.file ? (
                                                isImage ? (
                                                    <img
                                                        src={fileUrl}
                                                        alt="Proof"
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <a href={fileUrl} target="_blank" rel="noreferrer">View File</a>
                                                )
                                            ) : 'N/A'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reports;
