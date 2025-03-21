import React, { useState, useEffect } from 'react';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNotifications = async (studentId) => {
      try {
        const response = await fetch(`http://localhost:3000/courses/notifications/${studentId}`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setMessage('Failed to fetch notifications. Please try again.');
      }
    };

    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    // Decode the token to get the student ID
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token to extract the payload
    const studentId = decodedToken.id; // Get the user ID from the decoded token

    // Fetch notifications for the logged-in student
    fetchNotifications(studentId);
  }, []);

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:3000/courses/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
      } else {
        setMessage('Failed to delete notification. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      setMessage('Failed to delete notification. Please try again.');
    }
  };

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Your Notifications</h1>
      {message && <p className="error-message">{message}</p>}

      <div className="notifications-container">
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="notification-item">
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <small className="notification-timestamp">{new Date(notification.created_at).toLocaleString()}</small>
                </div>
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
