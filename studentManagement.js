import React, { useState, useEffect } from "react";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState({
    name: '',
    course: '',
    gradeMin: '',
    gradeMax: '',
  });
  const [sortOption, setSortOption] = useState('name'); // default sort by name

  // Function to fetch students from the backend
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/students");
      const data = await response.json();
      if (Array.isArray(data)) {
        setStudents(data);
        setFilteredStudents(data);
      } else {
        console.error("API did not return an array:", data);
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle search field changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  };

  // Function to download reports
  const handleExport = async (format) => {
    try {
      const response = await fetch(`http://localhost:5001/api/students/export/${format}`);
      if (!response.ok) throw new Error("Failed to download");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Filter students based on search input
  const filterStudents = () => {
    return students.filter((student) => {
      const matchesName = student.name.toLowerCase().includes(search.name.toLowerCase());
      const matchesCourse = student.course.toLowerCase().includes(search.course.toLowerCase());
      const matchesGrade =
        (search.gradeMin === '' || student.grade >= parseFloat(search.gradeMin)) &&
        (search.gradeMax === '' || student.grade <= parseFloat(search.gradeMax));

      return matchesName && matchesCourse && matchesGrade;
    });
  };

  // Sort students based on selected criteria
  const sortStudents = (students) => {
    return students.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'course') {
        return a.course.localeCompare(b.course);
      } else if (sortOption === 'grade') {
        return b.grade - a.grade; // descending grade
      }
      return 0;
    });
  };

  // Fetch students and apply filters on change
  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setFilteredStudents(filterStudents());
  }, [students, search]);

  useEffect(() => {
    setFilteredStudents(sortStudents(filteredStudents));
  }, [sortOption]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      {/* Search Form */}
      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={search.name}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="course"
          placeholder="Search by course"
          value={search.course}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded ml-2"
        />
        <input
          type="number"
          name="gradeMin"
          placeholder="Min grade"
          value={search.gradeMin}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded ml-2"
        />
        <input
          type="number"
          name="gradeMax"
          placeholder="Max grade"
          value={search.gradeMax}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded ml-2"
        />
      </div>

      {/* Sort Form */}
      <div className="mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="course">Sort by Course</option>
          <option value="grade">Sort by Grade</option>
        </select>
      </div>

      {/* Export Buttons */}
      <div className="mb-4">
        <button onClick={() => handleExport("json")} className="px-4 py-2 bg-blue-500 text-white rounded">Export JSON</button>
        <button onClick={() => handleExport("csv")} className="px-4 py-2 bg-green-500 text-white rounded ml-2">Export CSV</button>
        <button onClick={() => handleExport("txt")} className="px-4 py-2 bg-gray-500 text-white rounded ml-2">Export TXT</button>
      </div>

      {/* Student List */}
      {filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul className="space-y-2">
          {filteredStudents.map((student) => (
            <li
              key={student.id}
              className="flex justify-between p-2 border rounded shadow-sm hover:bg-gray-100"
            >
              <span>{student.name}</span>
              <span>{student.course}</span>
              <span>{student.grade}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentManagement;
