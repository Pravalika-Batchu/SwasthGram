import React from 'react';

const Profile = () => {
    const username = localStorage.getItem('username'); // Optional if stored

    return (
        <div className="profile-page">
            <h2>👤 Welcome to Your Profile</h2>
            <p><strong>Username:</strong> {username || 'N/A'}</p>

            <hr />
            <h4>🏅 Your Badges</h4>
            <ul>
                <li>🌟 First Report Submitted</li>
                <li>🕵️‍♀️ Active Hygiene Monitor</li>
                <li>🏆 Dengue Risk Spotter</li>
            </ul>

            <hr />
            <h4>📝 Your Activities</h4>
            <p>You’ve reported 5 hygiene issues. Keep it up for cleaner communities!</p>
        </div>
    );
};

export default Profile;
