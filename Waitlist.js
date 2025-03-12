import React, { useState } from 'react';

function Waitlist() {
  const [waitlist, setWaitlist] = useState([
    { id: 1, name: 'Student A', email: 'studenta@example.com', course: 'CHEM 123' },
    { id: 2, name: 'Student B', email: 'studentb@example.com', course: 'COSC 123' },
    { id: 3, name: 'Student C', email: 'studentc@example.com', course: 'CHEM 123' },
    { id: 4, name: 'Student D', email: 'studentd@example.com', course: 'MECH 221' },
    { id: 5, name: 'Student E', email: 'studente@example.com', course: 'MECH 221' },
  ]);
  const [filter, setFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');

  const removeStudent = (id) => {
    setWaitlist(waitlist.filter(student => student.id !== id));
  };

  const enrollStudent = (id) => {
    alert(`Enrolling student with ID: ${id}`);
    // Implement enrollment logic here
  };

  const groupedWaitlist = waitlist.reduce((acc, student) => {
    if (!acc[student.course]) {
      acc[student.course] = [];
    }
    acc[student.course].push(student);
    return acc;
  }, {});

  const filteredWaitlist = filter
    ? Object.keys(groupedWaitlist).reduce((acc, course) => {
        if (course.includes(filter)) {
          acc[course] = groupedWaitlist[course];
        }
        return acc;
      }, {})
    : groupedWaitlist;

  const handleFilter = () => {
    const filtered = waitlist.filter(student => {
      return (
        student.course.includes(facultyFilter) &&
        student.course.includes(programFilter)
      );
    });
    setWaitlist(filtered);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Waitlist</h2>
      <input
        type="text"
        placeholder="Filter by course"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 mb-4"
      />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by faculty"
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Filter by program"
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="border p-2 mb-2"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Apply Filters
        </button>
      </div>
      {Object.keys(filteredWaitlist).map(course => (
        <div key={course} className="mb-4">
          <h3 className="text-xl font-semibold">{course}</h3>
          <ul>
            {filteredWaitlist[course].map(student => (
              <li key={student.id} className="mb-2">
                {student.name} (ID: {student.id})
                <button
                  onClick={() => enrollStudent(student.id)}
                  className="ml-4 text-green-500 hover:text-green-700"
                >
                  Enroll
                </button>
                <button
                  onClick={() => removeStudent(student.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Waitlist;