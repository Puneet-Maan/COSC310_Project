import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './logIn.css';

function LogIn() {
  const [email, setEmail] = useState(''); // State to store the email
  const [password, setPassword] = useState(''); // State to store the password
  const [error, setError] = useState(''); // State to store the error message
  const [userName, setUserName] = useState(localStorage.getItem('userName') || ''); // State to store the user's name
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userName')); // State to store the login status

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the login endpoint
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        setUserName(response.data.userName); // Set the user's name
        localStorage.setItem('userName', response.data.userName); // Store the user's name in local storage
        setIsLoggedIn(true); // Set the login status to true
      } else {
        setError('Invalid email or password'); // Set the error message
      }
    } catch (err) {
      setError('An error occurred. Please try again.'); // Set the error message
    }
  };

  const handleClose = () => {
    setIsLoggedIn(false); // Set the login status to false
    setEmail(''); // Clear the email
    setPassword(''); // Clear the password
    setError(''); // Clear the error message
    localStorage.removeItem('userName'); // Remove the user's name from local storage
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div className="popup">
          <h2>Welcome, {userName}!</h2> {/* Display the user's name */}
          <button onClick={handleClose}>Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}

export default LogIn;
