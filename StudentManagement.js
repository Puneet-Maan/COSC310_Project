import React, { useState } from 'react';
import Modal from 'react-modal';
import './StudentManagement.css'; // Import custom CSS for modal styling

Modal.setAppElement('#root'); // Set the app element for accessibility

function StudentManagement() {
  // Hardcoded student data with detailed information
  const [students, setStudents] = useState([
    { id: 1, name: 'Student A', email: 'studenta@example.com', contact: '1234567890', address: '123 Main St', status: 'International', nationality: 'Brazil', program: 'Computer Science', faculty: 'Science', yearLevel: 'Sophomore', courses: ['CS101', 'CS102'], pastCourses: [{ name: 'CS100', grade: 'A', percentage: 95 }], currentCredits: 30, remainingCredits: 60, academicDegreeRequirements: [{ code: 'CS101', name: 'Intro to CS', completed: true, grade: 90 }, { code: 'CS102', name: 'Data Structures', completed: false }, { code: 'CS103', name: 'Algorithms', completed: false }], gpa: 90 },
    // More students here...
  ]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [nationality, setNationality] = useState('');
  const [program, setProgram] = useState('');
  const [faculty, setFaculty] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const addStudent = () => {
    if (editingId) {
      const updatedStudents = students.map(student =>
        student.id === editingId
          ? { id: editingId, name, email, contact, address, status, nationality, program, faculty, yearLevel, courses: student.courses, pastCourses: student.pastCourses }
          : student
      );
      setStudents(updatedStudents);
      setEditingId(null);
    } else {
      const newStudent = {
        id: students.length + 1,
        name,
        email,
        contact,
        address,
        status,
        nationality,
        program,
        faculty,
        yearLevel,
        courses: [],
        pastCourses: [],
        currentCredits: 0,
        remainingCredits: 0,
        academicDegreeRequirements: [],
        gpa: 0,
      };
      setStudents([...students, newStudent]);
    }
    setName('');
    setEmail('');
    setContact('');
    setAddress('');
    setStatus('');
    setNationality('');
    setProgram('');
    setFaculty('');
    setYearLevel('');
  };

  const editStudent = (id) => {
    const student = students.find(student => student.id === id);
    setName(student.name);
    setEmail(student.email);
    setContact(student.contact);
    setAddress(student.address);
    setStatus(student.status);
    setNationality(student.nationality);
    setProgram(student.program);
    setFaculty(student.faculty);
    setYearLevel(student.yearLevel);
    setEditingId(id);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleExport = async (format) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/export/${format}`);
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Student Management</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Status (International, Canadian)"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Program of Study"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Year Level"
          value={yearLevel}
          onChange={(e) => setYearLevel(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={addStudent}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editingId ? 'Update Student' : 'Add Student'}
        </button>
      </div>
      <div className="mb-4">
        <button onClick={() => handleExport("json")} className="bg-blue-500 text-white p-2 rounded">
          Export JSON
        </button>
        <button onClick={() => handleExport("csv")} className="bg-green-500 text-white p-2 rounded ml-2">
          Export CSV
        </button>
        <button onClick={() => handleExport("txt")} className="bg-gray-500 text-white p-2 rounded ml-2">
          Export TXT
        </button>
      </div>
      <ul>
        {students.map(student => (
          <li key={student.id} className="mb-2">
            <span
              onClick={() => selectStudent(student)}
              className="cursor-pointer text-blue-500 hover:text-blue-700"
            >
              {student.name} (ID: {student.id})
            </span> - {student.program} - {student.faculty}
            <button
              onClick={() => editStudent(student.id)}
              className="ml-4 text-yellow-500 hover:text-yellow-700"
            >
              Edit
            </button>
            <button
              onClick={() => deleteStudent(student.id)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {selectedStudent && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Student Details"
          className="modal-content"
          overlayClassName="overlay"
        >
          <div className="text-black">
            <h2 className="text-2xl font-semibold mb-4">Student Report: {selectedStudent.name}</h2>
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Program:</strong> {selectedStudent.program}</p>
            <p><strong>Faculty:</strong> {selectedStudent.faculty}</p>
            <p><strong>Year Level:</strong> {selectedStudent.yearLevel}</p>
            <p><strong>Current Address:</strong> {selectedStudent.address}</p>
            <p><strong>Nationality:</strong> {selectedStudent.nationality}</p>

            <h3 className="font-semibold mt-4">Emergency Contact:</h3>
            <p><strong>Name:</strong> {selectedStudent.emergencyContact?.name}</p>
            <p><strong>Relation:</strong> {selectedStudent.emergencyContact?.relation}</p>
            <p><strong>Phone:</strong> {selectedStudent.emergencyContact?.phone}</p>
            <p><strong>Email:</strong> {selectedStudent.emergencyContact?.email}</p>

            <h3 className="font-semibold mt-4">Current Courses:</h3>
            <ul>
              {selectedStudent.courses.map((course, index) => (
                <li key={index}>{course}</li>
              ))}
            </ul>

            <h3 className="font-semibold mt-4">Past Courses:</h3>
            <ul>
              {selectedStudent.pastCourses.map((course, index) => (
                <li key={index}>
                  {course.name} - Grade: {course.grade} ({course.percentage}%)
                </li>
              ))}
            </ul>

            <p><strong>Current Credits:</strong> {selectedStudent.currentCredits}</p>
            <p><strong>Remaining Credits:</strong> {selectedStudent.remainingCredits}</p>

            <h3 className="font-semibold mt-4">Academic Degree Requirements:</h3>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="border p-2">Course Code</th>
                  <th className="border p-2">Course Name</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Grade (%)</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.academicDegreeRequirements.map((course, index) => (
                  <tr key={index}>
                    <td className="border p-2">{course.code}</td>
                    <td className="border p-2">{course.name}</td>
                    <td className="border p-2">
                      {course.completed ? (
                        <span className="text-green-500">✔️</span>
                      ) : (
                        <span className="text-red-500">❌</span>
                      )}
                    </td>
                    <td className="border p-2">
                      {course.completed ? `${course.grade}%` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p><strong>Current GPA:</strong> {selectedStudent.gpa}%</p>

            <button onClick={closeModal} className="bg-blue-500 text-white p-2 rounded mt-4">Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default StudentManagement;