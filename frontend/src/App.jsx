import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Report from './pages/Report'; // assuming it's created
import Navbar from './components/Navbar';
import './App.css';
import Profile from './pages/Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access'));

  return (
    <>
      <Navbar token={token} setToken={setToken} />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
