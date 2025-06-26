// src/components/ReportForm.jsx

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons for local dev
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// ✅ This component allows selecting a point on the map
function LocationMarker({ setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return null;
}

// ✅ MAIN FORM COMPONENT
const ReportForm = () => {
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [position, setPosition] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [riskMessage, setRiskMessage] = useState('');

    // ✨ Rule-based risk prediction logic
    const predictRisk = (issueType, lat, lng) => {
        const month = new Date().getMonth(); // 0 = Jan, 6 = July
        let risk = null;

        if (issueType === 'stagnant_water' && month >= 5 && month <= 8) {
            risk = '⚠️ Dengue Risk in your area. Avoid stagnant water and use mosquito nets.';
        } else if (issueType === 'garbage') {
            risk = '⚠️ Sanitation Risk due to open garbage. Clean-up advised.';
        } else if (issueType === 'toilet') {
            risk = '⚠️ Hygiene Risk due to unclean toilets. Could cause infections.';
        }

        return risk;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!issueType || !position) {
            alert('Please select an issue type and a location.');
            return;
        }

        const formData = new FormData();
        formData.append('issue_type', issueType);
        formData.append('description', description);
        formData.append('latitude', position.lat);
        formData.append('longitude', position.lng);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            await axios.post('http://localhost:8000/api/reports/', formData);
            setSubmitted(true);
            const risk = predictRisk(issueType, position.lat, position.lng);
            setRiskMessage(risk);
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Something went wrong. Try again later.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>📋 Report Hygiene Issue</h2>

            {submitted ? (
                <>
                    <div className="alert alert-success">✅ Report submitted successfully!</div>
                    {riskMessage && (
                        <div className="alert alert-warning mt-2">{riskMessage}</div>
                    )}
                </>
            ) : (
                <form onSubmit={handleSubmit} className="card shadow p-4 bg-white rounded">
                    <div className="form-group">
                        <label><strong>Issue Type:</strong></label>
                        <select
                            className="form-control"
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            <option value="garbage">🗑️ Garbage Dump</option>
                            <option value="stagnant_water">💧 Stagnant Water</option>
                            <option value="toilet">🚽 Unclean Toilet</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label><strong>Description:</strong></label>
                        <textarea
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label><strong>Upload Photo:</strong></label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setPhoto(e.target.files[0])}
                        />
                    </div>

                    <div className="form-group">
                        <label><strong>Select Location on Map:</strong></label>
                        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '300px', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationMarker setPosition={setPosition} />
                            {position && <Marker position={position} />}
                        </MapContainer>
                        {position && (
                            <span className="badge bg-info mt-2">
                                📍 {position.lat.toFixed(3)}, {position.lng.toFixed(3)}
                            </span>
                        )}
                    </div>

                    <button type="submit" className="btn btn-success w-100 mt-4">
                        🚀 Submit Report
                    </button>
                </form>
            )}
        </div>
    );
};

export default ReportForm;
