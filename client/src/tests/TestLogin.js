import React, { useState } from 'react';
import axios from 'axios';

function TestLogin() {
  const [email, setEmail] = useState(''); // State to store the email
  const [password, setPassword] = useState(''); // State to store the password
  const [message, setMessage] = useState(''); // State to store the message

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the login endpoint
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        setMessage('Login successful!'); // Set success message
      } else {
        setMessage('Invalid email or password'); // Set failure message
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.'); // Set error message
    }
  };

  return (
    <div>
      <h2>Test Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
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
      {message && <p>{message}</p>} {/* Display the message */}
    </div>
  );
}

export default TestLogin;
