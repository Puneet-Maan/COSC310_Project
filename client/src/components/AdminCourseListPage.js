import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/globalStyles.css'; // Import the global styles

const AdminStudentCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState('');
  const [currentCourse, setCurrentCourse] = useState(null); 
  const [showModal, setShowModal] = useState(false);

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
          setError('Failed to fetch courses data. Please try again later.');
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
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course. Please try again.');
    }
  };

  // Open Modal for Editing
  const handleEdit = (course) => {
    setModalType('edit');
    setCurrentCourse(course);
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
      enrolled: 0,
    });
    setShowModal(true);
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
                <td>{course.instructor}</td>
                <td>{course.schedule}</td>
                <td>{course.capacity}</td>
                <td>{course.enrolled}</td>
                <td className="action-buttons">
                  <button className="edit-button" onClick={() => handleEdit(course)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(course.id)}>
                    Delete
                  </button>
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
                {/* Title above the form */}
             <h2>{modalType === 'edit' ? 'Edit Course' : 'Add New Course'}</h2>
             <div className="modal-form-content">
            <label>
              Name:
              <input
                type="text"
                value={currentCourse.name}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, name: e.target.value })
                }
              />
            </label>
            <label>
              Code:
              <input
                type="text"
                value={currentCourse.code}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, code: e.target.value })
                }
              />
            </label>
            <label>
              Instructor:
              <input
                type="text"
                value={currentCourse.instructor}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, instructor: e.target.value })
                }
              />
            </label>
            <label>
              Schedule:
              <input
                type="text"
                value={currentCourse.schedule}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, schedule: e.target.value })
                }
              />
            </label>
            <label>
              Capacity:
              <input
                type="number"
                value={currentCourse.capacity}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, capacity: parseInt(e.target.value) })
                }
              />
            </label>
            <label>
              Enrolled:
              <input
                type="number"
                value={currentCourse.enrolled}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, enrolled: parseInt(e.target.value) })
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

export default AdminStudentCoursePage;
