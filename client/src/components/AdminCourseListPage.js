import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/globalStyles.css'; // Import the global styles

const AdminCourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState('');
  const [currentCourse, setCurrentCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          return;
        }

        const response = await fetch('http://localhost:3000/admin/courses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          setFilteredCourses(data);
        } else {
          const errorData = await response.json();
          setError(`Failed to fetch courses data. Status: ${response.status}, Message: ${errorData?.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle search queries
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  // Delete Course Confirmation
  const confirmDelete = (id) => {
    setDeleteConfirmationId(id);
  };

  const cancelDelete = () => {
    setDeleteConfirmationId(null);
  };

  // Delete Course
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course.id !== id));
      setFilteredCourses(filteredCourses.filter((course) => course.id !== id));
      alert('Course deleted successfully!');
      setDeleteConfirmationId(null);
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course. Please try again.');
    }
  };

  // Open Modal for Editing
  const handleEdit = (course) => {
    setModalType('edit');
    setCurrentCourse({ ...course }); // Create a copy to avoid direct state modification
    setShowModal(true);
  };

  // Open Modal for Adding
  const handleAdd = () => {
    setModalType('add');
    setCurrentCourse({
      name: '',
      code: '',
      instructor: '',
      schedule: '',
      capacity: 0,
      credits: 0, // Initialize credits for adding
    });
    setShowModal(true);
  };

  // Update currentCourse state on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  // Save Course (Add or Edit)
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
          `http://localhost:3000/admin/courses/${currentCourse.id}`,
          currentCourse,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          const updatedCourses = courses.map((course) =>
            course.id === currentCourse.id ? { ...response.data } : course
          );
          setCourses(updatedCourses);
          setFilteredCourses(updatedCourses);
          alert('Course updated successfully!');
        }
      } else if (modalType === 'add') {
        response = await axios.post(
          'http://localhost:3000/admin/courses',
          currentCourse,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
          const addedCourse = response.data;
          setCourses((prevCourses) => [...prevCourses, addedCourse]);
          setFilteredCourses((prevCourses) => [...prevCourses, addedCourse]);
          alert('Course added successfully!');
        }
      }
    } catch (err) {
      console.error(`Error ${modalType === 'edit' ? 'updating' : 'adding'} course:`, err);
      alert(`Failed to ${modalType === 'edit' ? 'update' : 'add'} course. Please try again.`);
    } finally {
      setShowModal(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Admin - Course Management</h1>

      {/* Search Bar Section */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses by name, code, or instructor..."
          className="search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Add Course Button */}
      <div className="action-buttons">
        <button className="btn-primary" onClick={handleAdd}>
          Add New Course
        </button>
      </div>

      {/* Courses Table Section */}
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Credits</th> {/* Moved here */}
              <th>Instructor</th>
              <th>Schedule</th>
              <th>Capacity</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.credits}</td> {/* Moved here */}
                <td>{course.instructor}</td>
                <td>{course.schedule}</td>
                <td>{course.capacity}</td>
                <td>{course.enrolled}</td>
                <td className="action-buttons">
                  <button className="edit-button" onClick={() => handleEdit(course)}>
                    Edit
                  </button>
                  {deleteConfirmationId === course.id ? (
                    <div className="delete-confirmation">
                      <p>Are you sure?</p>
                      <button className="delete-button confirm" onClick={() => handleDelete(course.id)}>
                        Yes
                      </button>
                      <button className="cancel-button" onClick={cancelDelete}>
                        No
                      </button>
                    </div>
                  ) : (
                    <button className="delete-button" onClick={() => confirmDelete(course.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Course */}
      {showModal && (
        <div className="modal">
          <div className="modal-form">
            <h2>{modalType === 'edit' ? 'Edit Course' : 'Add New Course'}</h2>
            <div className="modal-form-content">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={currentCourse?.name || ''}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Code:
                <input
                  type="text"
                  name="code"
                  value={currentCourse?.code || ''}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Credits:
                <input
                  type="number"
                  name="credits"
                  value={currentCourse?.credits || 0}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Instructor:
                <input
                  type="text"
                  name="instructor"
                  value={currentCourse?.instructor || ''}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Schedule:
                <input
                  type="text"
                  name="schedule"
                  value={currentCourse?.schedule || ''}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Capacity:
                <input
                  type="number"
                  name="capacity"
                  value={currentCourse?.capacity || 0}
                  onChange={handleInputChange}
                />
              </label>
              {modalType === 'edit' && (
                <label>
                  Enrolled:
                  <input
                    type="number"
                    name="enrolled"
                    value={currentCourse?.enrolled || 0}
                    onChange={handleInputChange}
                    readOnly // Make it read-only for editing
                  />
                </label>
              )}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="modal">
          <div className="modal-form">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this course?</p>
            <div className="modal-buttons">
              <button className="delete-button confirm" onClick={() => handleDelete(deleteConfirmationId)}>
                Yes, Delete
              </button>
              <button className="cancel-button" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseListPage;