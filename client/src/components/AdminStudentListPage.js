import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/globalStyles.css'; // Import the global styles

const AdminStudentListPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enrollments, setEnrollments] = useState([]);

  // Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
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
          setError('Failed to fetch students data. Please try again later.');
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

  // Handle search queries
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

  // Delete Student
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter((student) => student.id !== id));
      setFilteredStudents(filteredStudents.filter((student) => student.id !== id));
      alert('Student deleted successfully!');
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student. Please try again.');
    }
  };

  // Open Modal for Editing
  const handleEdit = (student) => {
    setModalType('edit');
    setCurrentStudent(student);
    setShowModal(true);
  };

  // Open Modal for Adding
  const handleAdd = () => {
    setModalType('add');
    setCurrentStudent({
      name: '',
      email: '',
      age: '',
      major: '',
    });
    setShowModal(true);
  };

  // Save Student (Add or Edit)
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      return;
    }

    try {
      let response;
      if (modalType === 'edit') {
        response = await axios.put(
          `http://localhost:3000/admin/students/${currentStudent.id}`,
          currentStudent,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          const updatedStudents = students.map((student) =>
            student.id === currentStudent.id ? { ...response.data } : student
          );
          setStudents(updatedStudents);
          setFilteredStudents(updatedStudents);
          alert('Student updated successfully!');
        }
      } else if (modalType === 'add') {
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
        }
      }
    } catch (err) {
      console.error(`Error ${modalType === 'edit' ? 'updating' : 'adding'} student:`, err);
      alert(`Failed to ${modalType === 'edit' ? 'update' : 'add'} student. Please try again.`);
    } finally {
      setShowModal(false);
    }
  };

  // Replace fetchEnrollments with navigation
  const viewEnrollments = (studentId) => {
    navigate(`/admin/students/${studentId}/enrollments`);
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

      {/* Search Bar Section */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search students by name, email, or major..."
          className="search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Add Student Button */}
      <div className="action-buttons">
        <button className="btn-primary" onClick={handleAdd}>
          Add New Student
        </button>
      </div>

      {/* Students Table Section */}
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
                <button 
                    className="view-enrollments-button" 
                    onClick={() => viewEnrollments(student.id)}
                  >
                    View Enrollments
                  </button>
                  <button className="edit-button" onClick={() => handleEdit(student)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

{/* Modal for Add/Edit Student */}
{showModal && (
  <div className="modal">
    <div className="modal-form">
      {/* Title above the form */}
      <h2>{modalType === 'edit' ? 'Edit Student' : 'Add New Student'}</h2>
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
