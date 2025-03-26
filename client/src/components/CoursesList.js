import React, { useState, useEffect } from 'react';

// CourseItem component
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
          <button
            className="join-waitlist"
            onClick={() => handleEnroll(course.id)}
          >
            Join Waitlist
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => handleEnroll(course.id)}
          >
            Enroll
          </button>
        )}
      </td>
    </tr>
  );
}

function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [waitlistedCourses, setWaitlistedCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = async () => {
    const response = await fetch('http://localhost:3000/courses');
    const data = await response.json();
    setCourses(data);
  };

  const refreshStudentStatus = async (studentId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Enrolled
    const enrolledRes = await fetch(
      `http://localhost:3000/courses/enrolled-courses/${studentId}`
    );
    const enrolledData = await enrolledRes.json();
    setEnrolledCourses(enrolledData.map((course) => course.id));

    // Waitlisted
    const waitlistRes = await fetch(
      `http://localhost:3000/courses/waitlisted-courses/${studentId}`
    );
    const waitlistData = await waitlistRes.json();
    setWaitlistedCourses(waitlistData.map((course) => course.id));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    const decoded = JSON.parse(atob(token.split('.')[1]));
    const studentId = decoded.id;

    fetchCourses();
    refreshStudentStatus(studentId);
  }, []);

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const studentId = decoded.id;

    const response = await fetch('http://localhost:3000/courses/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, course_id: courseId }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      await fetchCourses();
      await refreshStudentStatus(studentId);
    }
  };

  const handleRemoveFromWaitlist = async (courseId) => {
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const studentId = decoded.id;

    const response = await fetch(
      'http://localhost:3000/courses/remove-waitlist',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      }
    );

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      await fetchCourses();
      await refreshStudentStatus(studentId);
    }
  };

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Course List</h1>

      {message && <div className="error-message">{message}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
                    <td>{course?.id || 'N/A'}</td>
                    <td>{course?.name || 'Course not found'}</td>
                    <td>{course?.instructor || 'N/A'}</td>
                    <td>{course?.schedule || 'N/A'}</td>
                    <td>
                      {course ? course.capacity - course.enrolled : 'N/A'} seats
                      left
                    </td>
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