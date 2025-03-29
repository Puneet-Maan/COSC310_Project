import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/globalStyles.css'; // Import your CSS file

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        navigate(data.user.role === 'admin' ? '/admin' : '/home');
      } else if (response.status === 401) {
        setMessage('Invalid credentials. Please try again.');
      } else {
        setMessage('Server error. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please check your connection.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">NullPointers</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn-primary">Login</button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
