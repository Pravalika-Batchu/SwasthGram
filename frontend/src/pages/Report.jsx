import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Report.css';

const defaultCenter = [20.5937, 78.9629]; // Center of India

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const LocationPicker = ({ setCoordinates }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setCoordinates({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
        }
    });
    return null;
};

const Report = () => {
    const [form, setForm] = useState({
        issue_type: '',
        description: '',
        latitude: '',
        longitude: '',
        file: null
    });

    const [status, setStatus] = useState('');

    const setCoordinates = ({ lat, lng }) => {
        setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation not supported.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                setCoordinates({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            },
            () => alert('Failed to fetch location.')
        );
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = e => {
        setForm(prev => ({ ...prev, file: e.target.files[0] }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!form.issue_type || !form.latitude || !form.longitude) {
            setStatus('❌ Please fill in all required fields.');
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (val) formData.append(key, val);
        });

        axios.post('http://localhost:8000/api/reports/', formData)
            .then(() => {
                setStatus('✅ Report submitted successfully!');
                setForm({ issue_type: '', description: '', latitude: '', longitude: '', file: null });
                setTimeout(() => window.location.href = '/', 1500);
            })
            .catch(() => setStatus('❌ Failed to submit the report.'));
    };

    return (
        <div className="report-page">
            <h2 className="report-title">📢 Report a Hygiene Issue</h2>

            <form onSubmit={handleSubmit} className="report-form">

                <label>🧾 Issue Type *</label>
                <select name="issue_type" value={form.issue_type} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="garbage">Garbage</option>
                    <option value="stagnant_water">Stagnant Water</option>
                    <option value="toilet">Unclean Toilet</option>
                </select>

                <label>📝 Description (optional)</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe the issue briefly..."
                />

                <label>📎 Upload Proof (optional)</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                />

                <div className="latlong">
                    <div>
                        <label>📍 Latitude *</label>
                        <input
                            type="text"
                            name="latitude"
                            value={form.latitude}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>📍 Longitude *</label>
                        <input
                            type="text"
                            name="longitude"
                            value={form.longitude}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button type="button" onClick={getLocation}>📌 Auto-Fill My Location</button>

                <div className="map-wrapper">
                    <h5>🗺️ Click on the map to select location:</h5>
                    <MapContainer center={defaultCenter} zoom={5} style={{ height: '350px', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker setCoordinates={setCoordinates} />
                        {form.latitude && form.longitude && (
                            <Marker position={[form.latitude, form.longitude]} />
                        )}
                    </MapContainer>
                </div>

                <button type="submit" className="submit-btn">✅ Submit Report</button>

                {status && <div className="status-msg">{status}</div>}
            </form>
        </div>
    );
};

export default Report;
