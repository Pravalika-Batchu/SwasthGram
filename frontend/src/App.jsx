import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RiskAnalysis from './pages/RiskAnalysis';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Report from './pages/Report';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import 'leaflet/dist/leaflet.css';
import './App.css';
import './index.css'; // ✅ correct import
import Profile from './pages/Profile';
import ResolveList from './pages/ResolveList';
import ResolveForm from './pages/ResolveForm';
import Leaderboard from './pages/Leaderboard';
import AskAI from './pages/AskAI';
import SwasthAI from './components/SwasthAI';
import Home from './pages/Home'; // ✅ correct import
function App() {
  const [token, setToken] = useState(localStorage.getItem('access'));

  return (

    <div className="glass-container">

      <Navbar token={token} setToken={setToken} />
      <div className="global-bg">
        <div className="aurora-layer aurora-layer-1"></div>
        <div className="aurora-layer aurora-layer-2"></div>
        <div className="aurora-layer aurora-layer-3"></div>
        <div className="gradient-overlay"></div>
      </div>
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/map" element={<RiskAnalysis />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resolve" element={<ResolveList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/resolve/:id" element={<ResolveForm />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/swasthai" element={<SwasthAI />} /> {/* ✅ Add route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
