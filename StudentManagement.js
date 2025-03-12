import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element for accessibility

function StudentManagement() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Student A', email: 'studenta@example.com', contact: '1234567890', address: '123 Main St', status: 'International', nationality: 'India', program: 'Computer Science', faculty: 'Science', courses: ['CS101', 'CS102'], pastCourses: [{ name: 'CS100', grade: 'A', percentage: 95 }] },
    { id: 2, name: 'Student B', email: 'studentb@example.com', contact: '0987654321', address: '456 Elm St', status: 'Canadian', nationality: 'Canada', program: 'Mechanical Engineering', faculty: 'Engineering', courses: ['ME101', 'ME102'], pastCourses: [{ name: 'ME100', grade: 'B', percentage: 85 }] },
    { id: 3, name: 'Student C', email: 'studentc@example.com', contact: '1122334455', address: '789 Oak St', status: 'International', nationality: 'China', program: 'Business Administration', faculty: 'Business', courses: ['BA101', 'BA102'], pastCourses: [{ name: 'BA100', grade: 'A-', percentage: 90 }] },
    { id: 4, name: 'Student D', email: 'studentd@example.com', contact: '2233445566', address: '321 Pine St', status: 'Canadian', nationality: 'Canada', program: 'Electrical Engineering', faculty: 'Engineering', courses: ['EE101', 'EE102'], pastCourses: [{ name: 'EE100', grade: 'B+', percentage: 88 }] },
    { id: 5, name: 'Student E', email: 'studente@example.com', contact: '3344556677', address: '654 Maple St', status: 'International', nationality: 'Brazil', program: 'Civil Engineering', faculty: 'Engineering', courses: ['CE101', 'CE102'], pastCourses: [{ name: 'CE100', grade: 'A', percentage: 92 }] },
    { id: 6, name: 'Student F', email: 'studentf@example.com', contact: '4455667788', address: '987 Birch St', status: 'Canadian', nationality: 'USA', program: 'Psychology', faculty: 'Arts', courses: ['PSY101', 'PSY102'], pastCourses: [{ name: 'PSY100', grade: 'A-', percentage: 89 }] },
  ]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [nationality, setNationality] = useState('');
  const [program, setProgram] = useState('');
  const [faculty, setFaculty] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const addStudent = () => {
    if (editingId) {
      const updatedStudents = students.map(student =>
        student.id === editingId
          ? { id: editingId, name, email, contact, address, status, nationality, program, faculty, courses: student.courses, pastCourses: student.pastCourses }
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
        courses: [],
        pastCourses: [],
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
        <button
          onClick={addStudent}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editingId ? 'Update Student' : 'Add Student'}
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
            </span> - {student.email} - {student.contact} - {student.address} - {student.status} - {student.nationality} - {student.program} - {student.faculty}
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
          className="modal"
          overlayClassName="overlay"
        >
          <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Current Courses:</strong></p>
          <ul>
            {selectedStudent.courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
          <p><strong>Past Courses:</strong></p>
          <ul>
            {selectedStudent.pastCourses.map((course, index) => (
              <li key={index}>
                {course.name} - Grade: {course.grade} ({course.percentage}%)
              </li>
            ))}
          </ul>
          <button onClick={closeModal} className="bg-blue-500 text-white p-2 rounded mt-4">Close</button>
        </Modal>
      )}
    </div>
  );
}

export default StudentManagement;