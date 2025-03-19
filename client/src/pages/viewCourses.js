import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use userId from localStorage instead of studentId
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userEmail) {
        setError("You must be logged in to view your courses");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // First, get the user account to get the user_id
        const accountResponse = await axios.get(`/api/account?email=${userEmail}`);
        const userId = accountResponse.data.user_id;
        
        if (!userId) {
          setError("Could not retrieve your user information");
          setLoading(false);
          return;
        }
        
        // Now fetch courses using the user_id
        const coursesResponse = await axios.get(`/api/student-courses/${userId}`);
        setCourses(coursesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError("Failed to load your courses. Please try again.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-[#1b2a4e] text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">My Courses</h1>
      
      {loading ? (
        <div className="text-center">Loading your courses...</div>
      ) : error ? (
        <div className="text-center text-red-400">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-700 text-left">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border border-gray-700 px-4 py-2">Course Code</th>
                <th className="border border-gray-700 px-4 py-2">Course Name</th>
                <th className="border border-gray-700 px-4 py-2">Department</th>
                <th className="border border-gray-700 px-4 py-2">Credits</th>
                <th className="border border-gray-700 px-4 py-2">Section</th>
                <th className="border border-gray-700 px-4 py-2">Instructor</th>
                <th className="border border-gray-700 px-4 py-2">Schedule</th>
                <th className="border border-gray-700 px-4 py-2">Room</th>
                <th className="border border-gray-700 px-4 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.enrollment_id} className="hover:bg-gray-700">
                    <td className="border border-gray-700 px-4 py-2">{course.course_code}</td>
                    <td className="border border-gray-700 px-4 py-2">{course.course_name}</td>
                    <td className="border border-gray-700 px-4 py-2">{course.department}</td>
                    <td className="border border-gray-700 px-4 py-2">{course.credits}</td>
                    <td className="border border-gray-700 px-4 py-2">{course.section_number || 'N/A'}</td>
                    <td className="border border-gray-700 px-4 py-2">{course.instructor || 'TBA'}</td>
                    <td className="border border-gray-700 px-4 py-2">{course.schedule || 'TBA'}</td>
                    <td className="border border-gray-700 px-4 py-2">{course.room || 'TBA'}</td>
                    <td className="border border-gray-700 px-4 py-2">{course.grade || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center border border-gray-700 px-4 py-2">
                    You are not enrolled in any courses.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewCourses;
