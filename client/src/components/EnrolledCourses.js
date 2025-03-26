import React, { useState, useEffect } from 'react';

function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('You are not logged in.');
          return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const studentId = decodedToken.id;

        // ✅ Updated to match new backend route for fetching grades too
        const response = await fetch(`http://localhost:3000/enrollments/student-enrollments/${studentId}`);
        const data = await response.json();

        if (response.ok) {
          setEnrolledCourses(data);
        } else {
          setMessage('Failed to fetch enrolled courses. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setMessage('Failed to fetch enrolled courses. Please try again.');
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleDrop = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in.');
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const studentId = decodedToken.id;

      const response = await fetch('http://localhost:3000/courses/drop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      });

      if (response.ok) {
        setMessage('Course dropped successfully!');
        setEnrolledCourses((prev) => prev.filter((course) => course.course_id !== courseId));
      } else {
        setMessage('Failed to drop course. Please try again.');
      }
    } catch (error) {
      console.error('Error dropping course:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handlePrintReport = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in.');
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const studentId = decodedToken.id;

      const response = await fetch(`http://localhost:3000/report/self-generate/${studentId}`, {
        method: 'POST'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'enrollment_report.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setMessage('Failed to generate report. Please try again.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setMessage('An error occurred while generating the report.');
    }
  };

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">My Enrolled Courses</h1>

      <button className="btn-reportself" onClick={handlePrintReport}>
        Print Enrollment Report
      </button>

      {message && <div className="error-message">{message}</div>}

      <div className="table-container">
        {enrolledCourses.length > 0 ? (
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((course) => (
                <tr key={course.enrollment_id}>
                  <td>{course.enrollment_id}</td>
                  <td>{course.course_code}</td>
                  <td>{course.course_name}</td>
                  <td>{course.grade || 'Not graded yet'}</td>
                  <td>
                    <button
                      className="cancel-button"
                      onClick={() => handleDrop(course.course_id)}
                    >
                      Drop
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
}

export default EnrolledCourses;