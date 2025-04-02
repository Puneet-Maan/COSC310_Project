import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/globalStyles.css';

const AdminStudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3000/admin/students', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudents(data);
          setFilteredStudents(data);
        } else {
          const errorData = await response.json();
          setError(`Failed to fetch students data. Status: ${response.status}, Message: ${JSON.stringify(errorData)}`);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.major.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleViewProfile = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const handleAdd = () => {
    setModalType('add');
    setCurrentStudent({ name: '', email: '', age: '', major: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      return;
    }

    try {
      let response;
      if (modalType === 'add') {
        response = await axios.post(
          'http://localhost:3000/admin/students',
          currentStudent,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
          const addedStudent = response.data;
          setStudents((prevStudents) => [...prevStudents, addedStudent]);
          setFilteredStudents((prevStudents) => [...prevStudents, addedStudent]);
          alert('Student added successfully!');
          setShowModal(false);
        } else {
          const errorData = response.data;
          alert(`Failed to add student. Status: ${response.status}, Message: ${JSON.stringify(errorData)}`);
        }
      }
    } catch (err) {
      console.error('Error adding student:', err);
      alert('Failed to add student. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading students...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Admin - Student Management</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search students by name, email, or major..."
          className="search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="action-buttons">
        <button className="btn-primary" onClick={handleAdd}>
          Add New Student
        </button>
      </div>

      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Major</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.age}</td>
                <td>{student.major}</td>
                <td className="action-buttons">
                  <button className="edit-button" onClick={() => handleViewProfile(student.id)}>
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && modalType === 'add' && (
        <div className="modal">
          <div className="modal-form">
            <h2>Add New Student</h2>
            <div className="modal-form-content">
              <label>
                Name:
                <input
                  type="text"
                  value={currentStudent.name}
                  onChange={(e) =>
                    setCurrentStudent({ ...currentStudent, name: e.target.value })
                  }
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={currentStudent.email}
                  onChange={(e) =>
                    setCurrentStudent({ ...currentStudent, email: e.target.value })
                  }
                />
              </label>
              <label>
                Age:
                <input
                  type="number"
                  value={currentStudent.age}
                  onChange={(e) =>
                    setCurrentStudent({ ...currentStudent, age: parseInt(e.target.value) })
                  }
                />
              </label>
              <label>
                Major:
                <input
                  type="text"
                  value={currentStudent.major}
                  onChange={(e) =>
                    setCurrentStudent({ ...currentStudent, major: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentListPage;