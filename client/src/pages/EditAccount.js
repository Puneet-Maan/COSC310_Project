import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditAccount() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Fetch user data from the server
    console.log(localStorage.getItem('userEmail'));
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail'); // Assuming email is stored in localStorage
        if (email) {
          const response = await axios.get('/api/user', { params: { email } });
          if (response.data) {
            setUserData(response.data);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleReset = () => {
    setIsEditing(false);
    setEditData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setPasswordError('');
  };

  const handleSave = async () => {
    if (editData.password && editData.password !== editData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (editData.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(editData.password)) {
      setPasswordError('Password must be at least 8 characters long and include an uppercase letter and a number');
      return;
    }
    try {
      const updatedData = {
        name: editData.name || userData.name,
        email: userData.email || editData.email,
        phone: editData.phone || userData.phone,
        password: editData.password ? editData.password : undefined, // Only send if password is set
      };
      await axios.put('/api/user', updatedData); // Adjust the endpoint as needed
      setUserData(updatedData);
      setIsEditing(false);
      setEditData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      setPasswordError('');
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <h2 className="text-4xl font-bold mb-8">Edit Account</h2>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mb-4">
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-4"
            >
              Edit
            </button>
          )}
        </div>
        {isEditing && (
          <div className="mt-4">
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={userData.name}
                  value={editData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={userData.email}
                  value={editData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder={userData.phone}
                  value={editData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">New Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={editData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700">Confirm New Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={editData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
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
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditAccount;
