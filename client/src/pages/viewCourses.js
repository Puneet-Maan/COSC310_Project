import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const studentId = localStorage.getItem('studentId'); // Assuming studentId is stored in localStorage

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/student-courses/${studentId}`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [studentId]);

  return (
    <div className="min-h-screen bg-[#1b2a4e] text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">My Courses</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-700 text-left">
          <thead>
            <tr className="bg-blue-700 text-white">
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
                  <td className="border border-gray-700 px-4 py-2">{course.section_number}</td>
                  <td className="border border-gray-700 px-4 py-2">{course.instructor}</td>
                  <td className="border border-gray-700 px-4 py-2">{course.schedule}</td>
                  <td className="border border-gray-700 px-4 py-2">{course.room}</td>
                  <td className="border border-gray-700 px-4 py-2">{course.grade || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center border border-gray-700 px-4 py-2">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewCourses;
