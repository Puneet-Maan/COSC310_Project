import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditAccount() {
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Fetch user data from the server
  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        try {
          const response = await axios.get('http://localhost:5001/api/user', { params: { email } });
          if (response.data) {
            setUserData(response.data);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    };

    fetchUserData();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Toggle editing state
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Reset edit state
  const handleReset = () => {
    setIsEditing(false);
    setEditData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    setPasswordError('');
  };

  // Save user data after validation
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
        password: editData.password ? editData.password : undefined,
      };
      await axios.put('/api/user', updatedData); // Adjust the endpoint as needed
      setUserData(updatedData);
      setIsEditing(false);
      resetEditData();
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  };

  // Reset the edit form data
  const resetEditData = () => {
    setEditData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    setPasswordError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1b2a4e] text-white">
      <h2 className="text-4xl font-bold mb-8">Edit Account</h2>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mb-4 text-black">
        <UserDataDisplay userData={userData} isEditing={isEditing} onEdit={handleEdit} />
        {isEditing && (
          <EditForm
            editData={editData}
            userData={userData}
            passwordError={passwordError}
            onChange={handleChange}
            onReset={handleReset}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

// Component for displaying user data
const UserDataDisplay = ({ userData, isEditing, onEdit }) => {
  return (
    <div>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone:</strong> {userData.phone}</p>
      {!isEditing && (
        <button
          type="button"
          onClick={onEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-4"
        >
          Edit
        </button>
      )}
    </div>
  );
};

// Component for the edit form
const EditForm = ({ editData, userData, passwordError, onChange, onReset, onSave }) => {
  return (
    <div className="mt-4">
      <form>
        <InputField
          label="Name"
          name="name"
          value={editData.name}
          placeholder={userData.name}
          onChange={onChange}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={editData.email}
          placeholder={userData.email}
          onChange={onChange}
        />
        <InputField
          label="Phone"
          name="phone"
          value={editData.phone}
          placeholder={userData.phone}
          onChange={onChange}
        />
        <InputField
          label="New Password"
          name="password"
          type="password"
          value={editData.password}
          onChange={onChange}
        />
        <InputField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={editData.confirmPassword}
          onChange={onChange}
        />
        {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable input field component
const InputField = ({ label, name, value, type = 'text', placeholder, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700">{label}:</label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  );
};

export default EditAccount;
