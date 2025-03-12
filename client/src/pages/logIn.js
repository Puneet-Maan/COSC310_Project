"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

function LogIn() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [userName, setUserName] = useState(localStorage.getItem('userName') || ''); 
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userName')); 
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', { email, password });
      if (response.data.success) {
        setUserName(response.data.userName); 
        localStorage.setItem('userName', response.data.userName); 
        localStorage.setItem('userEmail', email); // Store email in localStorage
        localStorage.setItem('userPhone', response.data.phone); // Store phone in localStorage
        setIsLoggedIn(true); 
        history.push('/'); // Redirect to home page
      } else {
        setError('Invalid email or password'); 
      }
    } catch (err) {
      console.error('Error logging in:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`An error occurred. Please try again. Error: ${err.message}`);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
    setEmail(''); 
    setPassword(''); 
    setError(''); 
    localStorage.removeItem('userName'); 
    localStorage.removeItem('userEmail'); // Remove email from localStorage
    localStorage.removeItem('userPhone'); // Remove phone from localStorage
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mb-4">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mb-4"
          >
            Login
          </button>
        </form>
        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
      {isLoggedIn && (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center mb-4">
          <h2 className="text-2xl font-bold mb-4">Welcome, {userName}!</h2>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-full mb-4"
          >
            Logout
          </button>
          <div className="text-center text-sm text-gray-500">
            <Link to="/edit-account" className="text-blue-500 hover:underline">
              Edit Account
            </Link>
          </div>
        </div>
      )}
      <button 
        onClick={() => history.push('/')} 
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mt-4"
      >
        Back to Home
      </button>
    </div>
  );
}

export default LogIn;
