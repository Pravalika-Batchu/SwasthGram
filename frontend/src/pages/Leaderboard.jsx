import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import './Leaderboard.css';
const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/leaderboard/')
            .then(res => setLeaders(res.data))
            .catch(err => console.error("Leaderboard error:", err));
    }, []);

    return (
        <div className="leaderboard-container">
            <h2>🏆 Leaderboard</h2>
            <table className="leaderboard-table">
                <thead>
                    <tr><th>Rank</th><th>User</th><th>Points</th></tr>
                </thead>
                <tbody>
                    {leaders.map((u, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{u.username}</td>
                            <td>{u.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {leaders.length === 0 && <p>No users yet. Be the first to report and earn points!</p>}
            <p>Earn points by reporting hygiene issues and resolving them!</p>
        </div>
    );
};

export default Leaderboard;
