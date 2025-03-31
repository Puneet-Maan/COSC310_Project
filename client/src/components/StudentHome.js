import React, { useEffect, useState } from 'react';

function StudentHome() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('You are not logged in.');
        }

        const response = await fetch(`http://localhost:3000/profile/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data. Please try again later.');
        }

        const data = await response.json();
        setProfile(data);

      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message || 'Network error. Please check your connection.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="student-home-page">
      <div className="admin-course-list-page">
        {/* Welcome Layer */}
        <h1 className="page-title">
          {profile ? profile.name : 'Student'}
        </h1>
        
        {/* Quick Info Layer */}
        <p className="intro-message">
          Welcome back! Explore the links in the navigation bar above to get started.
        </p>

        {/* Error Message Layer */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading Message */}
        {!profile && !error && <p className="error-message">Loading your profile...</p>}
      </div>
    </div>
  );
}

export default StudentHome;