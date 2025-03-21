import React, { useState, useEffect } from 'react';
import '../styles/globalStyles.css'; // Import the global styles

const AdminHome = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in.');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Admin Dashboard</h1>
      
      <div className="info-container">
        <p>Welcome to the admin dashboard! Navigate through the platform using the options in the navigation bar to manage different sections like courses, students, and waitlisted students.</p>
      </div>
    </div>
  );
};

export default AdminHome;
