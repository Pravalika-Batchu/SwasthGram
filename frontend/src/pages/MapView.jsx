import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { formatDistanceToNow } from 'date-fns';
import { getGeminiSeverity } from '../utils/openRouterHelper';

const severityColors = {
    high: 'red',
    medium: 'orange',
    low: 'green'
};

const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

const severityCircleStyle = (color) => ({
    color,
    fillColor: color,
    fillOpacity: 0.5
});

const AutoFocus = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.flyTo(position, 12);
    }, [position, map]);
    return null;
};

const MapView = ({ reports, highRiskZones }) => {
    const [aiSeverities, setAiSeverities] = useState({});
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // AI severity tagging
        const loadSeverities = async () => {
            const severityMap = {};
            for (const report of reports) {
                const key = `${report.id}`;
                const severity = await getGeminiSeverity(report.issue_type, report.description);
                severityMap[key] = severity;
            }
            setAiSeverities(severityMap);
            setLoading(false);
        };
        loadSeverities();
    }, [reports]);

    useEffect(() => {
        // Get user's location once
        navigator.geolocation.getCurrentPosition(
            pos => {
                setUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            },
            err => {
                console.warn("Geolocation error:", err);
            }
        );
    }, []);

    const fallbackCenter = [20.5937, 78.9629]; // Center of India
    const latestPosition = userLocation || fallbackCenter;

    return (
        <MapContainer center={latestPosition} zoom={5} style={{ height: '450px', width: '100%' }}>

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <AutoFocus position={latestPosition} />

            {/* User Location Marker */}
            {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                        📍 <strong>Your Current Location</strong><br />
                        Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                    </Popup>
                </Marker>
            )}

            {/* AI-colored Reports */}
            {!loading && reports.map((report, index) => {
                const severity = aiSeverities[`${report.id}`] || "medium";
                const color = severityColors[severity];

                return (
                    <CircleMarker
                        key={index}
                        center={[report.latitude, report.longitude]}
                        pathOptions={severityCircleStyle(color)}
                        radius={10}
                    >
                        <Popup autoPan={true}>
                            <div style={{ maxWidth: '250px', fontSize: '14px' }}>
                                <strong>🧾 Issue:</strong>{' '}
                                {report.issue_type === 'garbage' && '🗑️ '}
                                {report.issue_type === 'stagnant_water' && '💧 '}
                                {report.issue_type === 'toilet' && '🚽 '}
                                {report.issue_type.replace('_', ' ')}<br />

                                <strong>📝 Description:</strong> {report.description || 'N/A'}<br />
                                <strong>🕒 Reported:</strong> {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}<br />
                                <strong>👤 Reported by:</strong> {report.username}<br />
                                <strong>🧠 Severity:</strong>{' '}
                                {severity === 'high' && <span style={{ color: 'red' }}>🔴 High</span>}
                                {severity === 'medium' && <span style={{ color: 'orange' }}>🟠 Medium</span>}
                                {severity === 'low' && <span style={{ color: 'green' }}>🟢 Low</span>}
                                <br />

                                {report.file && (
                                    <>
                                        <hr />
                                        <strong>📎 Proof:</strong><br />
                                        {/\.(jpeg|jpg|png|gif)$/i.test(report.file) ? (
                                            <img
                                                src={`http://localhost:8000${report.file}`}
                                                alt="Proof"
                                                style={{ width: '100%', maxHeight: '150px', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <a href={`http://localhost:8000${report.file}`} target="_blank" rel="noreferrer">
                                                View Attached File
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}

            {/* Static Dengue Zones */}
            {highRiskZones.map((coords, i) => (
                <CircleMarker key={`hrz-${i}`} center={coords} pathOptions={{ color: 'darkred' }} radius={12}>
                    <Popup>
                        <strong>🔥 Dengue Risk Zone</strong><br />
                        Multiple stagnant water reports nearby.
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
};

export default MapView;
