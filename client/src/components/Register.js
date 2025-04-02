import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/globalStyles.css'; // Import your CSS file

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [major, setMajor] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, age, major, username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setTimeout(() => navigate('/'), 2000); // Redirect to login after successful registration
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setMessage('Network error. Please check your connection.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="academic-info-section" style={{ marginTop: '20px' }}>
            <h3>Enter Your Personal Information</h3>
            <div className="academic-info-form">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                required
              />
              <label htmlFor="major">Major</label>
              <input
                id="major"
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Enter your major"
                required
              />
            </div>
          </div>

          <div className="academic-info-section" style={{ marginTop: '20px' }}>
            <h3>Enter Your Account Information</h3>
            <div className="academic-info-form">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                required
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
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
              width: '100%',
            }}
          >
            Register
          </button>
        </form>

        {message && <p className="error-message">{message}</p>}

        <div className="register-link" style={{ textAlign: 'center', marginTop: '20px' }}>
          <span>Already have an account?</span>
          <button
            onClick={() => navigate('/')}
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
