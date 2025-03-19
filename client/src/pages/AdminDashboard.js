import React, { useState, useEffect } from 'react';

// Component for displaying a single course
const CourseCard = ({ course }) => {
  return (
    <li key={course.course_code} className="border p-2 mb-2">
      <p><strong>Course Code:</strong> {course.course_code}</p>
      <p><strong>Course Name:</strong> {course.course_name}</p>
      <p><strong>Department:</strong> {course.department}</p>
      <p><strong>Credits:</strong> {course.credits}</p>
      <p><strong>Requires Lab:</strong> {course.requires_lab ? 'Yes' : 'No'}</p>
    </li>
  );
};

// Component for adding a course form
const AddCourseForm = ({ onAddCourse }) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [department, setDepartment] = useState('');
  const [credits, setCredits] = useState('');
  const [requiresLab, setRequiresLab] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseCode || !courseName || !department || !credits) {
      alert('Please fill in all required fields!');
      return;
    }
    onAddCourse(courseCode, courseName, department, credits, requiresLab);
    setCourseCode('');
    setCourseName('');
    setDepartment('');
    setCredits('');
    setRequiresLab(false);
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <InputField label="Course Code" value={courseCode} onChange={setCourseCode} placeholder="e.g., CS101" />
        <InputField label="Course Name" value={courseName} onChange={setCourseName} placeholder="e.g., Introduction to Programming" />
        <InputField label="Department" value={department} onChange={setDepartment} placeholder="e.g., Computer Science" />
        <InputField label="Credits" value={credits} onChange={setCredits} type="number" placeholder="e.g., 3" />
        <div className="mb-4">
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
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Course</button>
      </form>
    </section>
  );
};

// Reusable input field component
const InputField = ({ label, value, onChange, type = 'text', placeholder }) => {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-gray-700">{label}:</label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border p-2 w-full mb-2 text-black"
      />
    </div>
  );
};

function AdminDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5001/admin/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Add a new course
  const handleAddCourse = async (courseCode, courseName, department, credits, requiresLab) => {
    try {
      const response = await fetch('http://localhost:5001/admin/add-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_code: courseCode,
          course_name: courseName,
          department: department,
          credits: parseInt(credits), // Ensure credits is an integer
          requires_lab: requiresLab,
        }),
      });

      if (response.ok) {
        alert('Course added successfully!');
        fetchCourses(); // Fetch courses again after adding a new one
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

      {/* Add Course Form */}
      <AddCourseForm onAddCourse={handleAddCourse} />

      {/* Display All Courses */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">All Courses</h2>
        <ul>
          {courses.map((course) => (
            <CourseCard key={course.course_code} course={course} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;
