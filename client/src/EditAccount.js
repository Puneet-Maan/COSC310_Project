import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditAccount() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Fetch user data from the server
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user'); // Adjust the endpoint as needed
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleReset = () => {
    setIsEditing(false);
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    // Fetch user data again to reset the form
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user'); // Adjust the endpoint as needed
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchUserData();
  };

  const handleSave = async () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setPasswordError('Password must be at least 8 characters long and contain both letters and numbers');
      return;
    }
    try {
      await axios.put('/api/user', { ...userData, password }); // Adjust the endpoint as needed
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <h2 className="text-4xl font-bold mb-8">Edit Account</h2>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mb-4">
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {isEditing && (
            <>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">New Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700">Confirm New Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
            </>
          )}
          {isEditing ? (
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditAccount;
