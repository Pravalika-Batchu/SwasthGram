import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/leaderboard/')
            .then((res) => setLeaders(res.data))
            .catch((err) => console.error("Leaderboard error:", err));
    }, []);

    return (
        <div className="leaderboard-root">
            <div className="container my-5 pt-5">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4 text-primary">🏆 Leaderboard</h2>
                        {leaders.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover text-center align-middle">
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col">Rank</th>
                                            <th scope="col">User</th>
                                            <th scope="col">Points</th>
                                        </tr>
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
                            </div>
                        ) : (
                            <p className="text-center text-muted">No users yet. Be the first to report and earn points!</p>
                        )}
                        <p className="text-center mt-3">
                            <em>Earn points by reporting hygiene issues and resolving them!</em>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
