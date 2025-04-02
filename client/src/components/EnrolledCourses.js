import React, { useState, useEffect } from 'react';

function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('You are not logged in.');
          return;
        }

        // Decode the token to get the student ID
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token to extract the payload
        const studentId = decodedToken.id; // Get the user ID from the decoded token

        // Fetch the enrolled courses for the logged-in student (ensure fresh data)
        const response = await fetch(`http://localhost:3000/courses/enrolled-courses/${studentId}?timestamp=${Date.now()}`);
        const data = await response.json();

        // Check if the response is valid
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
  }, []); // Empty dependency array ensures this only runs once on component mount

  const handleDrop = async (courseId) => {
    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in.');
        return;
      }

      // Decode the token to get the student ID
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token to extract the payload
      const studentId = decodedToken.id; // Get the user ID from the decoded token

      // Send request to drop the course
      const response = await fetch('http://localhost:3000/courses/drop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      });

      if (response.ok) {
        setMessage('Course dropped successfully!');
        setEnrolledCourses((prev) => prev.filter((course) => course.id !== courseId)); // Remove course from list
      } else {
        setMessage('Failed to drop course. Please try again.');
      }
    } catch (error) {
      console.error('Error dropping course:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">My Enrolled Courses</h1>

      {/* Message Display */}
      {message && <div className="error-message">{message}</div>}

      {/* Enrolled Courses Table Section */}
      <div className="table-container">
        {enrolledCourses.length > 0 ? (
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>{course.instructor}</td>
                  <td>{course.schedule}</td>
                  <td>
                    <button
                      className="cancel-button"
                      onClick={() => handleDrop(course.id)}
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
