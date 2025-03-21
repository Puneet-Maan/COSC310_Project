import React, { useState, useEffect } from 'react';

function EditProfile() {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    major: '',
  });
  const [updatedProfile, setUpdatedProfile] = useState({
    name: '',
    age: '',
    major: '',
  });
  const [loading, setLoading] = useState(true); // State to handle loading
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Fetch the current profile on component mount
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('You are not logged in.');
          return;
        }

        // Decode the token to extract the student ID
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
        const studentId = decodedToken.id;

        const response = await fetch(`http://localhost:3000/profile/${studentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setUpdatedProfile(data); // Prepopulate form with existing data
          setLoading(false);
        } else {
          setMessage('Failed to load profile data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Network error. Please check your connection.');
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in.');
        return;
      }

      // Decode the token to extract the student ID
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
      const studentId = decodedToken.id;

      const response = await fetch(`http://localhost:3000/profile/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setProfile(updatedProfile); // Update local profile state
        setIsModalOpen(false); // Close the modal after saving
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Network error. Please check your connection.');
    }
  };

  const handleCancel = () => {
    // Reset the form to the original profile data
    setUpdatedProfile(profile);
    setIsModalOpen(false); // Close the modal when cancelled
  };

  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  if (loading) {
    return <p>Loading profile...</p>; // Show a loading message while fetching data
  }

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Profile</h1>

      {/* Message Display */}
      {message && <div className="error-message">{message}</div>}

      {/* Display Profile Info in Table */}
      <table className="profile-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Name:</strong></td>
            <td>{profile.name}</td>
          </tr>
          <tr>
            <td><strong>Age:</strong></td>
            <td>{profile.age}</td>
          </tr>
          <tr>
            <td><strong>Major:</strong></td>
            <td>{profile.major}</td>
          </tr>
        </tbody>
      </table>

      {/* Edit Button to Open Modal */}
      <button onClick={openModal} className="btn-primary">Edit Profile</button>

      {/* Modal for editing profile */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-form">
            <h2>Edit Profile</h2>
            <form>
              <table className="profile-form-table">
                <tbody>
                  <tr>
                    <td><label htmlFor="name">Name:</label></td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={updatedProfile.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your name"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><label htmlFor="age">Age:</label></td>
                    <td>
                      <input
                        type="number"
                        name="age"
                        id="age"
                        value={updatedProfile.age}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your age"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><label htmlFor="major">Major:</label></td>
                    <td>
                      <input
                        type="text"
                        name="major"
                        id="major"
                        value={updatedProfile.major}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your major"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="button-container">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="btn-primary"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
