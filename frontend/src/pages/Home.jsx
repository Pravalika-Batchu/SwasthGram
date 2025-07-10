import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
    const [showTypewriter, setShowTypewriter] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTypewriter(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            title: "AI Detection & Reporting 🧠",
            desc: "Detect hygiene issues instantly and upload with AI-powered analysis.",
            link: "/report"
        },
        {
            title: "Leaderboard 🏆",
            desc: "See top contributors making a difference in community hygiene.",
            link: "/leaderboard"
        },
        {
            title: "Ask AI Bot 🧼",
            desc: "Get instant hygiene tips or ask about issues with our AI bot!",
            link: "/ask-ai"
        },
        {
            title: "Risk Zones 🗺️",
            desc: "Track high-risk areas and stagnant water with smart maps.",
            link: "/map"
        },
        {
            title: "Community Resolutions 🧑‍🤝‍🧑",
            desc: "Citizens resolve complaints with verified proof you can confirm!",
            link: "/community"
        },
    ];

    return (
        <div className="container-fluid px-0 home-root">
            {/* Hero Section */}
            <section className="hero-section text-white text-center py-5">
                <div className="hero-gradient">
                    <div className="particle-background"></div>
                    <div className="bubble-background">
                        <div className="bubble bubble-1"></div>
                        <div className="bubble bubble-2"></div>
                        <div className="bubble bubble-3"></div>
                        <div className="bubble bubble-4"></div>
                        <div className="bubble bubble-5"></div>
                        <div className="bubble bubble-6"></div>
                    </div>
                </div>

                {/* Floating AI Mascot */}
                <div className="ai-mascot floating">🏘️</div>

                {/* Typewriter Animated Heading */}
                <h1 className={`display-4 fw-bold ${showTypewriter ? 'typewriter-text' : ''}`}>
                    Welcome to <span className="text-warning">SwasthGram</span>
                </h1>
                <p className="lead">Your AI-powered hygiene guardian for cleaner communities.</p>
            </section>

            {/* About Section */}
            <section className="py-5 text-center about-section">
                <div className="container">
                    <h2 className="mb-3 section-title">About SwasthGram</h2>
                    <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
                        SwasthGram empowers citizens to report hygiene issues using AI, geolocation, and community support, fostering healthier societies through collective action.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5 features-section">
                <div className="container">
                    <h2 className="text-center mb-5 section-title">✨ Key Features</h2>
                    <div className="row justify-content-center g-4">
                        {features.map((feature, idx) => (
                            <div key={idx} className="col-md-4 feature-button-wrapper">
                                <button
                                    className="feature-button animate-fadeInUp"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                    onClick={() => window.location.href = feature.link}
                                >
                                    <div className="feature-button-content">
                                        <h5 className="feature-title">{feature.title}</h5>
                                        <p className="feature-text">{feature.desc}</p>
                                    </div>
                                </button>
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
                        <li>📸 Upload a hygiene issue photo</li>
                        <li>🤖 AI detects the problem</li>
                        <li>📍 Pin the location</li>
                        <li>✅ Submit your report</li>
                        <li>🌟 Community resolves it!</li>
                    </ol>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer py-4 text-center">
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
