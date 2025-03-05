import React, { useState } from 'react';

function AdminDashboard() {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [department, setDepartment] = useState('');
  const [credits, setCredits] = useState('');
  const [requiresLab, setRequiresLab] = useState(false);

  const handleAddCourse = async () => {
    console.log("Course Code:", courseCode);
    console.log("Course Name:", courseName);
    console.log("Department:", department);
    console.log("Credits:", credits);
    console.log("Requires Lab:", requiresLab);

    if (!courseCode || !courseName || !department || !credits) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/admin/add-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_code: courseCode,
          course_name: courseName,
          department: department,
          credits: parseInt(credits), // Ensure credits is sent as an integer
          requires_lab: requiresLab,
        }),
      });

      if (response.ok) {
        alert('Course added successfully!');
        // Clear the form
        setCourseCode('');
        setCourseName('');
        setDepartment('');
        setCredits('');
        setRequiresLab(false);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add course.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Course Management</h2>
        <div className="mb-4">
          <input
            type="text"
            id="courseCode"
            placeholder="Course Code (e.g., CS101)"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            id="courseName"
            placeholder="Course Name (e.g., Introduction to Programming)"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            id="department"
            placeholder="Department (e.g., Computer Science)"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <input
            type="number"
            id="credits"
            placeholder="Credits (e.g., 3)"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <label htmlFor="requiresLab" className="block mb-2">
            <input
              type="checkbox"
              id="requiresLab"
              checked={requiresLab}
              onChange={(e) => setRequiresLab(e.target.checked)}
              className="mr-2"
            />
            Requires Lab
          </label>
          <button
            onClick={handleAddCourse}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Course
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
