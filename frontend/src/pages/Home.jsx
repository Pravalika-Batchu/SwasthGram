// src/pages/Home.jsx
import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">

            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to <span className="brand">SwasthGram</span></h1>
                <p>Your AI-powered hygiene guardian for smarter and cleaner communities.</p>
                <div className="hero-buttons">
                    <a href="/report" className="btn-primary">📷 Report Issue</a>
                    <a href="/map" className="btn-secondary">🗺️ Explore Risk Zones</a>
                </div>
            </section>

            {/* About Section */}
            <section className="about">
                <h2> About SwasthGram</h2>
                <p>
                    SwasthGram is a public hygiene monitoring platform that empowers citizens to report
                    cleanliness issues using AI, geolocation, and community support. By harnessing collective action,
                    we aim to build a healthier and more aware society.
                </p>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="features-section">
                    <h2 className="section-title">✨ Key Features</h2>

                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>🧠 AI Detection</h3>
                            <p>Upload an image and let our AI model detect hygiene issues instantly.</p>
                        </div>

                        <div className="feature-card">
                            <h3>📝 Smart Reporting</h3>
                            <p>Report issues in seconds with AI-powered suggestions, geolocation & photo uploads — all in one page.</p>
                        </div>

                        <div className="feature-card">
                            <h3>🤖 Ask AI Bot</h3>
                            <p>Confused about a hygiene issue or health tip? Ask our integrated AI bot and get instant, intelligent suggestions!</p>
                        </div>

                        <div className="feature-card">
                            <h3>🗺️ Map-Based Risk Zones</h3>
                            <p>Track stagnant water clusters and high-risk areas based on seasonal and crowd-sourced data.</p>
                        </div>

                        <div className="feature-card">
                            <h3>🧑‍🤝‍🧑 Community Resolutions</h3>
                            <p>Other citizens can resolve your complaint and upload proof — verified by you!</p>
                        </div>
                    </div>
                </div>

            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <h2>🛠️ How It Works</h2>
                <ol>
                    <li>📸 Upload a photo of the hygiene issue</li>
                    <li>🤖 AI analyzes and detects the problem</li>
                    <li>📍 Pin the location</li>
                    <li>✅ Submit your report</li>
                    <li>🌟 Community helps resolve it!</li>
                </ol>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>Made with ❤️ by Team SwasthGram | © 2025</p>
                <p>
                    <a href="https://github.com/Pravalika-Batchu/SwasthGram" target="_blank" rel="noreferrer">GitHub Repo</a>
                </p>
            </footer>

        </div>
    );
};

export default Home;
