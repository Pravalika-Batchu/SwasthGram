import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import MapView from './MapView';
import { getGeminiText } from '../utils/openRouterHelper';
import './RiskAnalysis.css';

const RiskAnalysis = () => {
    const [reports, setReports] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');
    const [filter, setFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('all');
    const [highRiskZones, setHighRiskZones] = useState([]);
    const [communityInsight, setCommunityInsight] = useState('');
    const [loadingInsight, setLoadingInsight] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access');

        axios.get('http://localhost:8000/api/reports/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setReports(res.data))
            .catch(err => console.error('Failed to load reports:', err));

        axios.get('http://localhost:8000/api/highrisk-zones/')
            .then(res => setHighRiskZones(res.data))
            .catch(err => console.error('Failed to load risk zones:', err));
    }, []);

    const filteredReports = reports.filter(report => {
        const issueMatch = !filter || report.issue_type === filter;
        const days = timeFilter === 'all' ? Infinity : parseInt(timeFilter);
        const reportAgeInDays = (new Date() - new Date(report.created_at)) / (1000 * 60 * 60 * 24);
        return issueMatch && reportAgeInDays <= days;
    });

    const handleDelete = (id) => {
        const token = localStorage.getItem('access');
        if (window.confirm('Are you sure you want to delete this report?')) {
            axios.delete(`http://localhost:8000/api/reports/${id}/delete/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    setReports(prev => prev.filter(r => r.id !== id));
                    alert('✅ Report deleted!');
                })
                .catch(err => {
                    console.error('Delete error:', err);
                    alert('❌ Failed to delete the report.');
                });
        }
    };

    const generateCommunityInsight = async () => {
        if (filteredReports.length === 0) {
            alert('No reports to analyze!');
            return;
        }

        setLoadingInsight(true);
        const summaryData = filteredReports.map(r => `- ${r.issue_type.replace('_', ' ')} at (${r.latitude}, ${r.longitude})`).join('\n');

        const aiPrompt = `
You're a public health AI. Based on hygiene issue reports below, give a short 3-line summary of the potential risk in this area. Mention likely diseases and urgency.

Reports:
${summaryData}
        `.trim();

        const result = await getGeminiText(aiPrompt);
        setCommunityInsight(result);
        setLoadingInsight(false);
    };

    return (
        <div className="home-page">
            <h2 className="page-title">🧼 SwasthGram Hygiene Map</h2>

            <div className="filters">
                <select className="option-select" onChange={e => setSelectedFilter(e.target.value)} value={selectedFilter}>
                    <option value="">All Issues</option>
                    <option value="garbage">Garbage</option>
                    <option value="stagnant_water">Stagnant Water</option>
                    <option value="toilet">Toilet</option>
                </select>

                <select className="option-select" onChange={e => setSelectedTimeFilter(e.target.value)} value={selectedTimeFilter}>
                    <option value="all">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                </select>

                <button className="apply-btn" onClick={() => {
                    setFilter(selectedFilter);
                    setTimeFilter(selectedTimeFilter);
                }}>Apply</button>

                <button className="clear-btn" onClick={() => {
                    setSelectedFilter('');
                    setSelectedTimeFilter('all');
                    setFilter('');
                    setTimeFilter('all');
                }}>Clear</button>
                <br />
                <button className="analyze-btn" onClick={generateCommunityInsight}>
                    🧠 Analyze Area Risk
                </button>
            </div>

            <div className="map-container">
                <MapView reports={filteredReports} highRiskZones={highRiskZones} onDelete={handleDelete} />
            </div>

            <div className="legend">
                <h4>🧠 AI Severity Legend:</h4>
                <div>🔴 High Risk</div>
                <div>🟠 Medium Risk</div>
            </div>

            {loadingInsight && <p className="loading-text">⏳ Analyzing reports...</p>}

            {communityInsight && (
                <div className="ai-analysis">
                    <h4 className='dbot-title'>🧠 DoctorBot's Area Risk Insight:</h4>
                    <p className='dbot-desc'>{communityInsight}</p>
                </div>
            )}
        </div>
    );
};

export default RiskAnalysis;
