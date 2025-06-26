import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatDistanceToNow } from 'date-fns';
import './Home.css';

const icons = {
    garbage: new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/679/679922.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    }),
    stagnant_water: new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1123/1123525.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    }),
    toilet: new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2284/2284985.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    }),
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const dangerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619034.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
});

const AutoFocus = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.flyTo(position, 12);
    }, [position, map]);
    return null;
};

const Home = () => {
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState('');
    const [latestPosition, setLatestPosition] = useState(null);
    const [highRiskZones, setHighRiskZones] = useState([]);
    const [timeFilter, setTimeFilter] = useState('all');

    useEffect(() => {
        axios.get('http://localhost:8000/api/reports/').then(res => {
            setReports(res.data);
            if (res.data.length > 0) {
                const last = res.data[res.data.length - 1];
                setLatestPosition([last.latitude, last.longitude]);
            }
        });
        axios.get('http://localhost:8000/api/highrisk-zones/').then(res => setHighRiskZones(res.data));
    }, []);

    const filteredReports = reports.filter(report => {
        const issueMatch = !filter || report.issue_type === filter;
        const days = timeFilter === 'all' ? Infinity : parseInt(timeFilter);
        const diff = (new Date() - new Date(report.created_at)) / (1000 * 60 * 60 * 24);
        return issueMatch && diff <= days;
    });

    return (
        <div className="home-page">
            <h2 className="page-title">🧼 SwasthGram Hygiene Map</h2>

            <div className="filters">
                <select onChange={e => setFilter(e.target.value)} value={filter}>
                    <option value="">All Issues</option>
                    <option value="garbage">Garbage</option>
                    <option value="stagnant_water">Stagnant Water</option>
                    <option value="toilet">Toilet</option>
                </select>

                <select onChange={e => setTimeFilter(e.target.value)} value={timeFilter}>
                    <option value="all">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                </select>
            </div>

            <div className="map-container">
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {latestPosition && <AutoFocus position={latestPosition} />}

                    {filteredReports.map((report, index) => (
                        <Marker
                            key={index}
                            position={[report.latitude, report.longitude]}
                            icon={icons[report.issue_type] || L.Icon.Default}
                        >
                            <Popup autoPan={true}>
                                <div style={{ maxWidth: '250px' }}>
                                    <strong>🧾 Issue:</strong> {report.issue_type.replace('_', ' ')}<br />
                                    <strong>📝 Description:</strong> {report.description || 'N/A'}<br />
                                    <strong>🕒 Reported:</strong> {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}<br />
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
                        </Marker>
                    ))}

                    {highRiskZones.map((coords, i) => (
                        <Marker key={`hrz-${i}`} position={coords} icon={dangerIcon}>
                            <Popup>
                                <strong>🔥 Dengue Risk Zone</strong><br />
                                Multiple stagnant water reports nearby.<br />
                                Please avoid standing water & use mosquito nets.
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Legend */}
            <div className="legend">
                <h5>🗺️ Legend:</h5>
                <div className="legend-row">
                    <div className="legend-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/679/679922.png" width="20" alt="Garbage" />
                        <span>Garbage</span>
                    </div>
                    <div className="legend-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/1123/1123525.png" width="20" alt="Water" />
                        <span>Stagnant Water</span>
                    </div>
                    <div className="legend-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/2284/2284985.png" width="20" alt="Toilet" />
                        <span>Toilet</span>
                    </div>
                    <div className="legend-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/619/619034.png" width="20" alt="Danger" />
                        <span className="text-danger">Dengue Risk</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
