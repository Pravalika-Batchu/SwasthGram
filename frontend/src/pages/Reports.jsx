import React, { useState, useRef } from 'react';
import axios from 'axios';
import * as tmImage from '@teachablemachine/image';
import { getGeminiText } from '../utils/openRouterHelper';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Report.css';

const LocationMarker = ({ setForm }) => {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setForm((prev) => ({
                ...prev,
                latitude: e.latlng.lat.toFixed(6),
                longitude: e.latlng.lng.toFixed(6),
            }));
        },
    });

    return position === null ? null : <Marker position={position} />;
};

const Report = () => {
    const [form, setForm] = useState({
        issue_type: '',
        description: '',
        latitude: '',
        longitude: '',
        file: null,
    });

    const [prediction, setPrediction] = useState('');
    const [status, setStatus] = useState('');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [aiAdvice, setAiAdvice] = useState('');
    const [aiSummary, setAiSummary] = useState('');
    const fileInput = useRef();
    const mapRef = useRef();

    const speak = (text) => {
        if (!soundEnabled) return;
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(text);
        synth.speak(utter);
    };

    const loadModelAndPredict = async (imgElement) => {
        const modelURL = "/model/model.json";
        const metadataURL = "/model/metadata.json";
        const model = await tmImage.load(modelURL, metadataURL);
        const predictionResult = await model.predict(imgElement);
        const topPrediction = predictionResult.reduce((a, b) =>
            a.probability > b.probability ? a : b
        );

        const rawLabel = topPrediction.className;
        const mappedLabel = {
            "Garbage": "garbage",
            "Stagnant Water": "stagnant_water",
            "Unclean Toilet": "unclean_toilet",
        }[rawLabel] || "";

        const confidence = (topPrediction.probability * 100).toFixed(2);
        setPrediction(`${rawLabel} (${confidence}%)`);
        setForm((prev) => ({ ...prev, issue_type: mappedLabel }));

        speak(`This looks like ${rawLabel}. Please complete the form.`);

        const descPrompt = `Write a short(around 3-10 line) hygiene complaint description from a citizen who found ${rawLabel.toLowerCase()}. Include urgency, inconvenience, and polite language.`;
        const aiDesc = await getGeminiText(descPrompt);
        setForm((prev) => ({ ...prev, description: aiDesc }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        const fileURL = URL.createObjectURL(file);
        img.src = fileURL;
        img.onload = () => {
            loadModelAndPredict(img);
            URL.revokeObjectURL(fileURL);
        };

        setForm((prev) => ({ ...prev, file }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const autofillLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setForm((prev) => ({
                        ...prev,
                        latitude: latitude.toFixed(6),
                        longitude: longitude.toFixed(6),
                    }));
                },
                (err) => {
                    alert("Failed to get location. Please allow location access.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            formData.append(key, form[key]);
        });

        try {
            const token = localStorage.getItem('access');
            await axios.post('https://swasthgram.onrender.com/api/reports/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setStatus('✅ Report submitted successfully!');

            const advicePrompt = `Give 2 quick hygiene or safety suggestions for someone who notices ${form.issue_type.replace('_', ' ')} nearby.`;
            const advice = await getGeminiText(advicePrompt);
            setAiAdvice(advice);

            const summaryPrompt = `Summarize this hygiene complaint in 1 sentence for admin review:\n\nIssue Type: ${form.issue_type}\nDescription: ${form.description}`;
            const summary = await getGeminiText(summaryPrompt);
            setAiSummary(summary);
        } catch (error) {
            console.error('Error submitting report:', error);
            setStatus('❌ Failed to submit report. Try again.');
        }
    };

    const zoomIn = () => {
        if (mapRef.current) {
            mapRef.current.setZoom(mapRef.current.getZoom() + 1);
        }
    };

    const zoomOut = () => {
        if (mapRef.current) {
            mapRef.current.setZoom(mapRef.current.getZoom() - 1);
        }
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className="report-page">
                <h2 className="report-title">🧠 SwasthAI Hygiene Report</h2>

                <form onSubmit={handleSubmit} className="report-form">
                    <div className="mb-3 row align-items-center">
                        <div className="col-md-8 mb-2 mb-md-0">
                            <input
                                className="form-control"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInput}
                                required
                            />
                        </div>
                        <div className="col-md-4 text-md-end text-center">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm px-3 py-1"
                                onClick={() => setSoundEnabled(!soundEnabled)}
                            >
                                {soundEnabled ? '🔊 Mute Voice' : '🔇 Unmute'}
                            </button>
                        </div>
                    </div>

                    {prediction && <p className="text-muted">Prediction: {prediction}</p>}

                    <label>Issue Type</label>
                    <select
                        className="form-select"
                        name="issue_type"
                        value={form.issue_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Issue Type</option>
                        <option value="stagnant_water">Stagnant Water</option>
                        <option value="garbage">Garbage</option>
                        <option value="unclean_toilet">Unclean Toilet</option>
                    </select>


                    <label>Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows="4"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the hygiene issue"
                        required
                    />

                    <label>📍 Select Location on Map</label>
                    <div className="map-wrapper">
                        <MapContainer
                            ref={mapRef}
                            center={[20.5937, 78.9629]}
                            zoom={4}
                            style={{ height: '300px', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationMarker setForm={setForm} />
                        </MapContainer>
                        <div className="custom-zoom-controls">
                            <button className="zoom-btn" onClick={zoomIn}>+</button>
                            <button className="zoom-btn" onClick={zoomOut}>-</button>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <label>Latitude</label>
                            <input
                                className="form-control"
                                type="text"
                                name="latitude"
                                value={form.latitude}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label>Longitude</label>
                            <input
                                className="form-control"
                                type="text"
                                name="longitude"
                                value={form.longitude}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 my-3 justify-content-center">
                        <button
                            type="button"
                            className="btn btn-info btn-sms1"
                            onClick={autofillLocation}
                        >
                            📍 Autofill My Location
                        </button>
                        <button type="submit" className="btn btn-success btn-sms2">
                            Submit Report
                        </button>
                    </div>

                    {status && <p className="status-msg">{status}</p>}
                    {aiAdvice && (
                        <div className="status-msg">
                            <strong>🧼 Safety Tip:</strong><br />
                            {aiAdvice}
                        </div>
                    )}
                    {aiSummary && (
                        <div className="status-msg">
                            <strong>📝 AI Summary:</strong><br />
                            {aiSummary}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Report;
