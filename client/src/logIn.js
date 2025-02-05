"use client";

import React, { useState, useEffect } from 'react';
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
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        setUserName(response.data.userName); 
        localStorage.setItem('userName', response.data.userName); 
        setIsLoggedIn(true); 
      } else {
        setError('Invalid email or password'); 
      }
    } catch (err) {
      setError('An error occurred. Please try again.'); 
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
    setEmail(''); 
    setPassword(''); 
    setError(''); 
    localStorage.removeItem('userName'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
          <a href="/signup" className="text-blue-500 hover:underline">
            Create an account
          </a>
        </div>
      </div>
      {isLoggedIn && (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome, {userName}!</h2>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-full mb-4"
          >
            Logout
          </button>
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
