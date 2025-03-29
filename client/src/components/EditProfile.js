import React, { useState, useEffect } from 'react';

function EditProfile() {
  const [profile, setProfile] = useState({ name: '', age: '', major: '' });
  const [updatedProfile, setUpdatedProfile] = useState({ name: '', age: '', major: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in.');
        setLoading(false);
        return;
      }


      try {
        const response = await fetch(`http://localhost:3000/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error();

        const data = await response.json();
        setProfile(data);
        setUpdatedProfile(data);
      } catch {
        setMessage('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) throw new Error();

      setMessage('Profile updated successfully!');
      setProfile(updatedProfile);
      closeModal();
    } catch {
      setMessage('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setUpdatedProfile(profile);
    closeModal();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Profile</h1>
      {message && <div className="error-message">{message}</div>}

      <table className="profile-table">
        <thead>
          <tr><th>Field</th><th>Details</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Name:</strong></td><td>{profile.name}</td></tr>
          <tr><td><strong>Age:</strong></td><td>{profile.age}</td></tr>
          <tr><td><strong>Major:</strong></td><td>{profile.major}</td></tr>
        </tbody>
      </table>

      <button onClick={openModal} className="btn-primary">Edit Profile</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-form">
            <h2>Edit Profile</h2>
            <form>
              <table className="profile-form-table">
                <tbody>
                  {['name', 'age', 'major'].map((field) => (
                    <tr key={field}>
                      <td><label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label></td>
                      <td>
                        <input
                          type={field === 'age' ? 'number' : 'text'}
                          name={field}
                          id={field}
                          value={updatedProfile[field]}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder={`Enter your ${field}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="button-container">
                <button type="button" onClick={handleUpdateProfile} className="btn-primary">Save</button>
                <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;