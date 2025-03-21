import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import '../styles/globalStyles.css'; // Import your CSS file

function NavBar({ isLoggedIn, handleLogout, notificationCount }) {
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;
        setUserRole(decodedToken.role || '');

        // Fetch user data from the '/profile/:id' endpoint
        const fetchUserData = async () => {
          const response = await fetch(`http://localhost:3000/profile/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUserName(userData.name || decodedToken.username);  // Use 'name' or fallback to 'username'
          } else {
            console.error('Failed to fetch user data');
          }
        };

        fetchUserData();
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole('');
      }
    }

    // Dynamically set padding to avoid overlap
    const navbar = document.querySelector('.nav-wrapper');
    if (navbar) {
      document.body.style.paddingTop = `${navbar.offsetHeight}px`;
    }
  }, [isLoggedIn]);

  return (
    <nav className="nav-wrapper">
      {/* Centered Links */}
      <div className="links-wrapper">
        {isLoggedIn ? (
          <>
            {userRole === 'admin' ? (
              <>
                <Link className="nav-link" to="/admin">Admin</Link>
                <Link className="nav-link" to="/students">Students</Link>
                <Link className="nav-link" to="/course-list">Courses</Link>
                <Link className="nav-link" to="/waitlist">Waitlist</Link>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/home">Home</Link>
                <Link className="nav-link" to="/courses">Courses</Link>
                <Link className="nav-link" to="/enrolled">My Courses</Link>
                <Link className="nav-link" to="/edit-profile">Profile</Link>
                <Link className="nav-link" to="/calendar">Calendar</Link>
                <Link className="notification-link" to="/notifications">
                  <FaBell size={20} />
                  {notificationCount > 0 && (
                    <span className="notification-badge">{notificationCount}</span>
                  )}
                </Link>
              </>
            )}
          </>
        ) : (
          <Link className="nav-link" to="/">Login</Link>
        )}
      </div>

      {/* Right Section (User Name and Logout Button) */}
      <div className="right-section">
        {isLoggedIn && (
          <>
            {/* Displaying the user's name */}
            <span className="user-name">🥵 {userName}</span>
            <div className="nav-link logout-button" onClick={handleLogout}>Logout</div>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
