import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faBirthdayCake, faBook, faCheckCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const AdminStudentProfilePage = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [waitlistedCourses, setWaitlistedCourses] = useState([]);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [message, setMessage] = useState('');
  const [isMarkCompleteModalOpen, setIsMarkCompleteModalOpen] = useState(false);
  const [courseToMarkComplete, setCourseToMarkComplete] = useState(null);
  const [completionGrade, setCompletionGrade] = useState('');
  const [markCompleteError, setMarkCompleteError] = useState(null);

  const dividerStyle = {
    border: '0',
    height: '1px',
    background: '#ccc',
    margin: '20px 0',
  };

  const darkModeDividerStyle = {
    ...dividerStyle,
    background: '#555',
  };

  const fetchStudentDetails = async () => {
    setLoading(true);
    setError(null);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in.');
        return;
      }
      const response = await fetch(`http://localhost:3000/admin/students/${studentId}/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);
        setUpdatedStudent(data.student);
        setEnrolledCourses(data.enrolledCourses);
        setWaitlistedCourses(data.waitlistedCourses);
      } else if (response.status === 404) {
        setError('Student not found.');
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch student details. Status: ${response.status}, Message: ${errorData?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const openEditModal = () => {
    setUpdatedStudent({ ...student });
    setIsEditModalOpen(true);
    setMessage('');
    setError(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setMessage('');
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent({ ...updatedStudent, [name]: value });
  };

  const handleSaveStudentInfo = async () => {
    setMessage('');
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in.');
        return;
      }
      const response = await fetch(`http://localhost:3000/admin/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedStudent),
      });
      if (response.ok) {
        const updatedData = await response.json();
        setStudent(updatedData);
        setIsEditModalOpen(false);
        setMessage('Student information updated successfully.');
      } else {
        const errorData = await response.json();
        setError(`Failed to update student information. Status: ${response.status}, Message: ${errorData?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleEnrollCourse = async () => {
    setMessage('');
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in.');
        return;
      }
      const enrollUrl = `http://localhost:3000/admin/students/${studentId}/enroll`;
      const response = await fetch(enrollUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ courseCode: newCourseCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data.enrolledCourses);
        setNewCourseCode('');
        setMessage('Course added successfully.');
      } else {
        const errorData = await response.json();
        setError(errorData?.message || `Failed to enroll student. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleDropCourse = async (courseId) => {
    setMessage('');
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in.');
        return;
      }
      const response = await fetch(`http://localhost:3000/admin/students/${studentId}/drop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });
      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data.enrolledCourses);
        setMessage('Course dropped successfully.');
      } else {
        const errorData = await response.json();
        setError(errorData?.message || `Failed to drop course. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error dropping course:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleViewCompletedCourses = () => {
    navigate(`/admin/students/${studentId}/completed-courses`);
  };

  const openMarkCompleteModal = (course) => {
    setCourseToMarkComplete(course);
    setCompletionGrade('');
    setMarkCompleteError(null);
    setIsMarkCompleteModalOpen(true);
  };

  const closeMarkCompleteModal = () => {
    setIsMarkCompleteModalOpen(false);
    setCourseToMarkComplete(null);
    setCompletionGrade('');
    setMarkCompleteError(null);
  };

  const handleMarkCourseComplete = async () => {
    if (!courseToMarkComplete || !completionGrade) {
      setMarkCompleteError('Please enter a grade.');
      return;
    }

    setMarkCompleteError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMarkCompleteError('You are not logged in.');
        return;
      }
      const response = await fetch('http://localhost:3000/api/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId: student.user_id, courseId: courseToMarkComplete.id, grade: completionGrade.toUpperCase() }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Course "<span class="math-inline">\{courseToMarkComplete\.name\}" marked as completed with grade "</span>{completionGrade.toUpperCase()}".`);
        closeMarkCompleteModal();
        // Update the enrolledCourses state by removing the completed course
        setEnrolledCourses(prevEnrolledCourses =>
          prevEnrolledCourses.filter(course => course.id !== courseToMarkComplete.id)
        );
      } else {
        const errorData = await response.json();
        setMarkCompleteError(`Failed to mark course as completed: ${response.status} - ${errorData?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error marking course as complete:', error);
      setMarkCompleteError('Network error. Please try again.');
    }
  };

  if (loading) return <div className="loading-spinner">Loading student profile...</div>;
  if (error?.startsWith('Student not found')) return <div className="error-message">{error}</div>;
  if (error?.startsWith('You are not logged in')) return <div className="error-message">{error}</div>;
  if (error?.startsWith('Network error')) return <div className="error-message">{error}</div>;
  if (!student) return <div>Student not found.</div>;

  const isDarkMode = localStorage.getItem('theme') === 'dark';
  const currentDividerStyle = isDarkMode ? darkModeDividerStyle : dividerStyle;

  return (
    <div className={`admin-course-list-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1 className="page-title">Student Profile</h1>

      {/* Student Information Section */}
      <div className="profile-details-container">
        <h2 className="section-title">Student Information</h2>
        {message === 'Student information updated successfully.' && <div className="success-message">{message}</div>}
        {error?.startsWith('Failed to update student information') && <div className="error-message">{error}</div>}
        <div className="profile-info-grid">
          <div className="info-item">
            <FontAwesomeIcon icon={faUser} className="info-icon" />
            <strong>ID:</strong>
            <span>{student.id}</span>
          </div>
          <div className="info-item">
            <FontAwesomeIcon icon={faUser} className="info-icon" />
            <strong>Name:</strong>
            <span>{student.name}</span>
          </div>
          <div className="info-item">
            <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
            <strong>Email:</strong>
            <span>{student.email}</span>
          </div>
          <div className="info-item">
            <FontAwesomeIcon icon={faBirthdayCake} className="info-icon" />
            <strong>Age:</strong>
            <span>{student.age}</span>
          </div>
          <div className="info-item">
            <FontAwesomeIcon icon={faBook} className="info-icon" />
            <strong>Major:</strong>
            <span>{student.major}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-button" onClick={openEditModal}>Edit Profile</button>
          <button className="view-completed-button" onClick={handleViewCompletedCourses}>
            <FontAwesomeIcon icon={faCheckCircle} className="button-icon" /> View Completed Courses
          </button>
        </div>
      </div>
      <hr style={currentDividerStyle} />

      {/* Enrolled Courses Section */}
      <div className="table-container">
        <h2 className="section-title">Enrolled Courses</h2>
        {message === 'Course dropped successfully.' && <div className="success-message">{message}</div>}
        {error?.startsWith('Failed to drop course') && <div className="error-message">{error}</div>}
        {message?.startsWith('Course') && message?.endsWith('marked as completed') && <div className="success-message">{message}</div>}
        {enrolledCourses.length > 0 ? (
          <table className="students-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map(course => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.instructor}</td>
                  <td>{course.schedule}</td>
                  <td className="action-buttons">
                    <button className="delete-button" onClick={() => handleDropCourse(course.id)}>Drop</button>
                    <button className="edit-button" onClick={() => openMarkCompleteModal(course)}>Mark Complete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No enrolled courses.</p>
        )}
      </div>
      <hr style={currentDividerStyle} />

      {/* Add Course Section - UPDATED */}
      <div className="academic-info-section">
        <h3><FontAwesomeIcon icon={faPlusCircle} className="section-icon" /> Add Course</h3>
        {message === 'Course added successfully.' && <div className="success-message">{message}</div>}
        {error && !error?.startsWith('Student not found') && !error?.startsWith('You are not logged in') && !error?.startsWith('Network error') && <div className="error-message">{error}</div>}
        <div className="academic-info-form">
          <label htmlFor="newCourseCode">Course Code:</label>
          <input
            type="text"
            id="newCourseCode"
            value={newCourseCode}
            onChange={(e) => setNewCourseCode(e.target.value)}
            placeholder="Enter course code"
          />
          {/* You could add an empty div here to maintain the grid structure if needed for other elements later */}
          <div></div>
        </div>
        <button className="btn-primary" onClick={handleEnrollCourse} style={{ marginTop: '10px' }}>Enroll Course</button>
      </div>
      <hr style={currentDividerStyle} />

      {/* Waitlisted Courses Section */}
      <div className="table-container">
        <h2 className="section-title">Waitlisted Courses</h2>
        {waitlistedCourses.length > 0 ? (
          <table className="students-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {waitlistedCourses.map(course => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No waitlisted courses.</p>
        )}
      </div>
      <hr style={currentDividerStyle} />

      {/* Back to Student List Button */}
      <div className="action-buttons">
        <button className="btn-primary" onClick={() => navigate('/students')}>
          Back to Student List
        </button>
      </div>

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-form">
            <h2 className="modal-title">Edit Student Information</h2>
            <div className="modal-form-content">
              <div className="form-group">
                <label htmlFor="editStudentId" className="form-label">ID:</label>
                <input type="text" id="editStudentId" className="search-input" value={student.id} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="editName" className="form-label">Name:</label>
                <input
                  type="text"
                  id="editName"
                  className="search-input"
                  name="name"
                  value={updatedStudent.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editEmail" className="form-label">Email:</label>
                <input
                  type="email"
                  id="editEmail"
                  className="search-input"
                  name="email"
                  value={updatedStudent.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editAge" className="form-label">Age:</label>
                <input
                  type="number"
                  id="editAge"
                  className="search-input"
                  name="age"
                  value={updatedStudent.age || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editMajor" className="form-label">Major:</label>
                <input
                  type="text"
                  id="editMajor"
                  className="search-input"
                  name="major"
                  value={updatedStudent.major || ''}
                  onChange={handleInputChange}/>
                  </div>
                </div>
                <div className="modal-buttons">
                  <button className="btn-primary" onClick={handleSaveStudentInfo}>Save</button>
                  <button className="cancel-button" onClick={closeEditModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}
    
          {/* Mark as Complete Modal */}
          {isMarkCompleteModalOpen && courseToMarkComplete && (
            <div className="modal">
              <div className="modal-form">
                <h2 className="modal-title">Mark Course as Completed</h2>
                <p>Mark "{courseToMarkComplete.name}" as completed for {student.name}?</p>
                {markCompleteError && <div className="error-message">{markCompleteError}</div>}
                <div className="form-group">
                  <label htmlFor="completionGrade" className="form-label">Grade (A+ to F):</label>
                  <input
                    type="text"
                    id="completionGrade"
                    className="search-input"
                    value={completionGrade}
                    onChange={(e) => setCompletionGrade(e.target.value)}
                  />
                  <p className="form-text">Please enter a valid grade: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, F</p>
                </div>
                <div className="modal-buttons">
                  <button className="btn-primary" onClick={handleMarkCourseComplete}>Mark Complete</button>
                  <button className="cancel-button" onClick={closeMarkCompleteModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };
    
    export default AdminStudentProfilePage;