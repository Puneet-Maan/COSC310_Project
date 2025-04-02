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
      const response = await fetch('http://localhost:3000/auth/login', {
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

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">NullPointers</h1>

        <form onSubmit={handleSubmit}>
          <div className="academic-info-section" style={{ marginTop: '20px' }}>
            <h3>Enter Your Account Information</h3>
            <div className="academic-info-form">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
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
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: '6px 12px',
              margin: '5px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'white',
              marginTop: '0px',
              width: '90%',
            }}
          >
            Login
          </button>
        </form>
        {message && <p className="error-message">{message}</p>}

        <div className="register-link" style={{ textAlign: 'center', marginTop: '20px' }}>
          Don't have an account?
          <button
            onClick={handleRegisterRedirect}
            className="btn-edit-button"
            style={{
              padding: '6px 12px',
              margin: '5px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'white',
              marginTop: '10px',
              backgroundColor: '#2196F3',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
