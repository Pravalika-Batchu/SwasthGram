import React, { useState, useRef } from 'react'; // Import useState and useRef from React
import axios from 'axios'; // Import axios for HTTP requests
import * as tmImage from '@teachablemachine/image'; // Import Teachable Machine image module
import { getGeminiText } from '../utils/openRouterHelper'; // Import your custom Gemini text function
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'; // Import React-Leaflet components
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import './Report.css'; // Import your custom CSS

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
    const mapRef = useRef(); // Add ref to control the map instance

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

        const label = topPrediction.className;
        const confidence = (topPrediction.probability * 100).toFixed(2);

        setPrediction(`${label} (${confidence}%)`);
        setForm((prev) => ({ ...prev, issue_type: label }));

        speak(`This looks like ${label}. Please complete the form.`);

        const descPrompt = `Write a short(around 3-10 line)hygiene complaint description from a citizen who found ${label.replace('_', ' ')}. Include urgency, inconvenience, and polite language.`;
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
            await axios.post('http://localhost:8000/api/reports/', formData, {
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

    // Function to zoom in
    const zoomIn = () => {
        if (mapRef.current) {
            mapRef.current.setZoom(mapRef.current.getZoom() + 1);
        }
    };

    // Function to zoom out
    const zoomOut = () => {
        if (mapRef.current) {
            mapRef.current.setZoom(mapRef.current.getZoom() - 1);
        }
    };

    return (
        <div className="report-page">
            <h2 className="report-title">🧠 SwasthAI Hygiene Report</h2>

            <form onSubmit={handleSubmit} className="report-form">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input className="file-input" type="file" name="file" accept="image/*" onChange={handleFileChange} ref={fileInput} required />
                    <button type="button" className="mute-voice" onClick={() => setSoundEnabled(!soundEnabled)}>
                        {soundEnabled ? '🔊Mute AI Voice' : '🔇Unmute AI Voice'}
                    </button>
                </div>

                {prediction && <p className="prediction">Prediction: {prediction}</p>}

                <label>Issue Type</label>
                <input
                    type="text"
                    name="issue_type"
                    value={form.issue_type}
                    onChange={handleChange}
                    placeholder="Auto-filled by AI"
                    required
                />

                <label>Description</label>
                <textarea
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
                        ref={mapRef} // Attach ref to control the map
                        center={[20.5937, 78.9629]}
                        zoom={4}
                        style={{ height: '300px', width: '100%' }}
                        zoomControl={false} // Disable default zoom controls
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker setForm={setForm} />
                    </MapContainer>
                    {/* Custom zoom buttons */}
                    <div className="custom-zoom-controls">
                        <button className="zoom-btn" onClick={zoomIn}>+</button>
                        <button className="zoom-btn" onClick={zoomOut}>-</button>
                    </div>
                </div>

                <div className="latlong">
                    <div>
                        <label>Latitude</label>
                        <input type="text" name="latitude" value={form.latitude} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Longitude</label>
                        <input type="text" name="longitude" value={form.longitude} onChange={handleChange} required />
                    </div>
                </div>

                <button type="button" className='autofill-loc' onClick={autofillLocation}>📍 Autofill My Location</button>

                <button type="submit" className="submit-btn">Submit Report</button>

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
    );
};

export default Report;