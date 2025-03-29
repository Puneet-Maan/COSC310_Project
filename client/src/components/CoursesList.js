import React, { useState, useEffect } from 'react';

// CourseItem.js
function CourseItem({
  course,
  enrolledCourses,
  waitlistedCourses,
  handleEnroll,
  handleRemoveFromWaitlist,
}) {
  return (
    <tr key={course.id}>
      <td>{course.id}</td>
      <td>{course.name}</td>
      <td>{course.instructor}</td>
      <td>{course.schedule}</td>
      <td>{course.capacity - course.enrolled} seats left</td>
      <td className="action-buttons">
        {enrolledCourses.includes(course.id) ? (
          <button className="btn-disabled" disabled>
            Already Enrolled
          </button>
        ) : waitlistedCourses.includes(course.id) ? (
          <button
            className="cancel-button"
            onClick={() => handleRemoveFromWaitlist(course.id)}
          >
            Remove from Waitlist
          </button>
        ) : course.enrolled >= course.capacity ? (
          <button className="join-waitlist" onClick={() => handleEnroll(course.id)}>
            Join Waitlist
          </button>
        ) : ( 
          <button className="btn-primary" onClick={() => handleEnroll(course.id)}>
            Enroll
          </button>
        )}
      </td>
    </tr>
  );
}

// Main CoursesList Component
function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]); // Tracks IDs of enrolled courses
  const [waitlistedCourses, setWaitlistedCourses] = useState([]); // Tracks IDs of waitlisted courses
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setMessage('Failed to fetch courses. Please try again.');
      }
    };

    const fetchEnrolledCourses = async (studentId) => {
      try {
        const response = await fetch(`http://localhost:5000/courses/enrolled-courses/${studentId}`);
        const data = await response.json();
        setEnrolledCourses(data.map((course) => course.id)); // Extract IDs of enrolled courses
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setMessage('Failed to fetch enrolled courses. Please try again.');
      }
    };

    const fetchWaitlistedCourses = async (studentId) => {
      try {
        const response = await fetch(`http://localhost:5000/courses/waitlisted-courses/${studentId}`);
        const data = await response.json();
        setWaitlistedCourses(data.map((course) => course.id)); // Extract IDs of waitlisted courses
      } catch (error) {
        console.error('Error fetching waitlisted courses:', error);
        setMessage('Failed to fetch waitlisted courses. Please try again.');
      }
    };

    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    // Decode the token to get the student ID
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token to extract the payload
    const studentId = decodedToken.id; // Get the user ID from the decoded token

    // Fetch data for the logged-in student
    fetchCourses();
    fetchEnrolledCourses(studentId);
    fetchWaitlistedCourses(studentId);
  }, []);

  // Handle enrollment or adding to waitlist
  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in.');
        return;
      }

      // Decode the token to get the student ID
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token to extract the payload
      const studentId = decodedToken.id; // Get the user ID from the decoded token

      const response = await fetch('http://localhost:5000/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        // If successfully enrolled, update enrolled courses
        if (!data.waitlisted) {
          setEnrolledCourses((prev) => [...prev, courseId]); // Add the course ID to enrolledCourses
        } else {
          // If added to the waitlist, update waitlisted courses
          setWaitlistedCourses((prev) => [...prev, courseId]);
        }

        // Refetch courses to reflect the updated seats
        const updatedCoursesResponse = await fetch('http://localhost:5000/courses');
        const updatedCourses = await updatedCoursesResponse.json();
        setCourses(updatedCourses);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  // Handle removing from waitlist
  const handleRemoveFromWaitlist = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in.');
        return;
      }

      // Decode the token to get the student ID
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token to extract the payload
      const studentId = decodedToken.id; // Get the user ID from the decoded token

      const response = await fetch('http://localhost:5000/courses/remove-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        // Update waitlisted courses
        setWaitlistedCourses((prev) => prev.filter((id) => id !== courseId));

        // Refetch courses to reflect the updated seats
        const updatedCoursesResponse = await fetch('http://localhost:5000/courses');
        const updatedCourses = await updatedCoursesResponse.json();
        setCourses(updatedCourses);
      }
    } catch (error) {
      console.error('Error removing from waitlist:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="admin-course-list-page">
      
      <h1 className="page-title">Course List</h1>

            {/* Message Display */}
            {message && <div className="error-message">{message}</div>}
      

      {/* Search Bar Section */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>



{/* Waitlist Section */}
<div className="table-container">
  <h2>Your Waitlisted Courses</h2>
  {waitlistedCourses.length > 0 ? (
    <table className="students-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Course Name</th>
          <th>Instructor</th>
          <th>Schedule</th>
          <th>Seats Left</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {waitlistedCourses.map((courseId) => {
          const course = courses.find((c) => c.id === courseId);
          return (
            <tr key={courseId}>
              <td>{course ? course.id : 'N/A'}</td>
              <td>{course ? course.name : 'Course not found'}</td>
              <td>{course ? course.instructor : 'Instructor not available'}</td>
              <td>{course ? course.schedule : 'Schedule not available'}</td>
              <td>{course ? course.capacity - course.enrolled : 'N/A'} seats left</td>
              <td>
                <button
                  className="cancel-button"
                  onClick={() => handleRemoveFromWaitlist(courseId)}
                >
                  Remove from Waitlist
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <p>You are not waitlisted for any courses.</p>
  )}
</div>



      {/* Courses Table Section */}
      <div className="table-container">
      <h2>All Courses</h2>

        <table className="students-table">
          
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Instructor</th>
              <th>Schedule</th>
              <th>Seats Left</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses
              .filter((course) =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((course) => (
                <CourseItem
                  key={course.id}
                  course={course}
                  enrolledCourses={enrolledCourses}
                  waitlistedCourses={waitlistedCourses}
                  handleEnroll={handleEnroll}
                  handleRemoveFromWaitlist={handleRemoveFromWaitlist}
                />
              ))}
          </tbody>
        </table>
      </div>


    </div>
  );
}

export default CoursesList;
