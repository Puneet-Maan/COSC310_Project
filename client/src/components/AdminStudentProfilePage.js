import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/globalStyles.css';

function AdminStudentProfilePage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [waitlistedCourses, setWaitlistedCourses] = useState([]);
  const [newCourseId, setNewCourseId] = useState('');
  const [editingStudent, setEditingStudent] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Helper function for API calls
  const apiCall = async (url, method = 'GET', body = null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in.');
        return null;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        setError('Failed to complete the request. Please try again later.');
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error('API call error:', err);
      setError('Network error. Please check your connection.');
      return null;
    }
  };

  // Fetch student profile on component mount
  useEffect(() => {
    const fetchStudentProfile = async () => {
      const data = await apiCall(`http://localhost:3000/courses/students/${studentId}`);
      if (data) {
        setStudent(data.student);
        setEnrolledCourses(data.enrolledCourses);
        setWaitlistedCourses(data.waitlistedCourses);
        setError('');
      }
      setLoading(false);
    };

    fetchStudentProfile();
  }, [studentId]);

  // Handle input changes for editing student info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent({ ...updatedStudent, [name]: value });
  };

  // Save updated student info
  const saveStudentInfo = async () => {
    const data = await apiCall(`http://localhost:3000/students/${studentId}`, 'PUT', updatedStudent);
    if (data) {
      setStudent(data);
      setEditingStudent(false);
      setError('');
    }
  };

  // Add a course for the student
  const addCourse = async () => {
    const data = await apiCall(`http://localhost:3000/courses/enroll`, 'POST', {
      student_id: studentId,
      course_id: newCourseId,
    });
    if (data) {
      setEnrolledCourses([...enrolledCourses, data]);
      setNewCourseId('');
      setError('');
    }
  };

  // Drop a course for the student
  const dropCourse = async (courseId) => {
    const success = await apiCall(`http://localhost:3000/courses/drop`, 'POST', {
      student_id: studentId,
      course_id: courseId,
    });
    if (success) {
      setEnrolledCourses(enrolledCourses.filter(course => course.id !== courseId));
      setError('');
    }
  };

  if (loading) {
    return <p>Loading student profile...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className={localStorage.getItem('theme') === 'dark' ? 'dark-mode' : 'light-mode'}>
      <div className="page-wrapper">
        <h1 className="page-title">Student Profile</h1>

        {editingStudent ? (
          <div className="profile-form">
            <p><strong>ID:</strong> {student.id}</p>
            <label>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={updatedStudent.name || student.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </label>
            <label>
              <strong>Email:</strong>
              <input
                type="text"
                name="email"
                value={updatedStudent.email || student.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </label>
            <label>
              <strong>Age:</strong>
              <input
                type="number"
                name="age"
                value={updatedStudent.age || student.age}
                onChange={handleInputChange}
                className="form-input"
              />
            </label>
            <label>
              <strong>Major:</strong>
              <input
                type="text"
                name="major"
                value={updatedStudent.major || student.major}
                onChange={handleInputChange}
                className="form-input"
              />
            </label>
            <div className="form-actions">
              <button className="button save-button" onClick={saveStudentInfo}>Save</button>
              <button className="button cancel-button" onClick={() => setEditingStudent(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>ID:</strong> {student.id}</p>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Age:</strong> {student.age}</p>
            <p><strong>Major:</strong> {student.major}</p>
            <button onClick={() => setEditingStudent(true)} className="button edit-button">Edit</button>
          </div>
        )}

        <h2 className="section-title">Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <table className="course-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map(course => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.instructor}</td>
                  <td>{course.schedule}</td>
                  <td>
                    <button className="button drop-button" onClick={() => dropCourse(course.id)}>Drop</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No enrolled courses available.</p>
        )}

        <h2 className="section-title">Add a Course</h2>
        <div className="add-course-form">
          <label>
            Course ID:
            <input
              type="text"
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              className="form-input"
            />
          </label>
          <button className="button add-course-button" onClick={addCourse}>Add Course</button>
        </div>

        <h2 className="section-title">Waitlisted Courses</h2>
        {waitlistedCourses.length > 0 ? (
          <ul className="course-list">
            {waitlistedCourses.map(course => (
              <li key={course.id}>{course.name}</li>
            ))}
          </ul>
        ) : (
          <p className="no-data-message">No waitlisted courses available.</p>
        )}
      </div>
    </div>
  );
}

export default AdminStudentProfilePage;