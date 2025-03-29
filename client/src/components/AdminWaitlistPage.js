import React, { useEffect, useState } from 'react';
import '../styles/globalStyles.css'; // Make sure this path points to the global CSS

const AdminWaitlistPage = () => {
  const [waitlistedStudents, setWaitlistedStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlistedStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          return;
        }

        const response = await fetch('http://localhost:3000/courses/waitlisted-students', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setWaitlistedStudents(data);
        } else {
          setError('Failed to fetch waitlisted students data. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching waitlisted students:', error);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlistedStudents();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading waitlisted students...</div>;
  }

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Waitlisted Students</h1>

      {error && <div className="error-message">{error}</div>}

      {waitlistedStudents.length > 0 ? (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Major</th>
                <th>Position</th>
                <th>Course Name</th>
                <th>Course Code</th>
                <th>Instructor</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {waitlistedStudents.map(student => (
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td>{student.student_name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>{student.major}</td>
                  <td>{student.position}</td>
                  <td>{student.course_name}</td>
                  <td>{student.course_code}</td>
                  <td>{student.instructor}</td>
                  <td>{student.schedule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No students on the waitlist.</div>
      )}
    </div>
  );
};

export default AdminWaitlistPage;
