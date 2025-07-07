import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
    const features = [
        {
            title: "🧠 AI Detection",
            desc: "Upload an image and let our AI model detect hygiene issues instantly.",
        },
        {
            title: "📝 Smart Reporting",
            desc: "Report issues in seconds with AI-powered suggestions, geolocation & photo uploads.",
        },
        {
            title: "🤖 Ask AI Bot",
            desc: "Ask our AI bot about hygiene issues or get health tips instantly!",
        },
        {
            title: "🗺️ Risk Zones",
            desc: "Track stagnant water clusters and high-risk areas using smart maps.",
        },
        {
            title: "🧑‍🤝‍🧑 Community Resolutions",
            desc: "Other citizens can resolve your complaint and upload proof — verified by you!",
        },
    ];

    return (
        <div className="container-fluid px-0 home-root">

            {/* Hero Section */}
            <section className="bg-primary text-white text-center py-5 hero-section">
                <h1 className="display-4 fw-bold animate-fadeZoom">Welcome to <span className="text-warning">SwasthGram</span></h1>
                <p className="lead animate-fadeZoom">Your AI-powered hygiene guardian for smarter and cleaner communities.</p>
                <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
                    <a href="/report" className="btn btn-danger btn-lg">📷 Report Issue</a>
                    <a href="/map" className="btn btn-info btn-lg">🗺️ Explore Risk Zones</a>
                </div>
            </section>

            {/* About Section */}
            <section className="py-5 text-center about-section">
                <div className="container">
                    <h2 className="mb-3 section-title">About SwasthGram</h2>
                    <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
                        SwasthGram is a public hygiene monitoring platform that empowers citizens to report
                        cleanliness issues using AI, geolocation, and community support. By harnessing collective action,
                        we aim to build a healthier and more aware society.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5 features-section">
                <div className="container">
                    <h2 className="text-center mb-5 section-title">✨ Key Features</h2>
                    <div className="row justify-content-center g-4">
                        {features.map((feature, idx) => (
                            <div key={idx} className="col-md-4 feature-card-wrapper">
                                <div
                                    className="card h-100 shadow-sm text-center feature-card animate-fadeInUp"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title">{feature.title}</h5>
                                        <p className="card-text">{feature.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-5 how-section text-center">
                <div className="container">
                    <h2 className="mb-4 section-title">🛠️ How It Works</h2>
                    <ol className="text-start mx-auto" style={{ maxWidth: '600px', lineHeight: '1.8' }}>
                        <li>📸 Upload a photo of the hygiene issue</li>
                        <li>🤖 AI analyzes and detects the problem</li>
                        <li>📍 Pin the location</li>
                        <li>✅ Submit your report</li>
                        <li>🌟 Community helps resolve it!</li>
                    </ol>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer text-white py-4 text-center">
                <p className="mb-1">Made with ❤️ by Pravalika Batchu | © 2025</p>
                <p>
                    <a className="text-info text-decoration-none" href="https://github.com/Pravalika-Batchu/SwasthGram" target="_blank" rel="noreferrer">
                        GitHub Repo
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Home;
