import React from 'react';
import { Link } from 'react-router-dom';

export function StudentForm({ newStudent, setNewStudent, handleAddStudent, editingStudent, setEditingStudent, handleUpdateStudent }) {
  return (
    <div className="form-container">
      <h2 className="form-title">{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
      <form className="student-form">
        <div className="form-field">
          <label htmlFor="id">ID:</label>
          <input
            id="id"
            type="number"
            placeholder="Enter ID"
            value={editingStudent ? editingStudent.id : newStudent.id}
            onChange={(e) => editingStudent ? setEditingStudent({ ...editingStudent, id: e.target.value }) : setNewStudent({ ...newStudent, id: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            placeholder="Enter Name"
            value={editingStudent ? editingStudent.name : newStudent.name}
            onChange={(e) => editingStudent ? setEditingStudent({ ...editingStudent, name: e.target.value }) : setNewStudent({ ...newStudent, name: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Enter Email"
            value={editingStudent ? editingStudent.email : newStudent.email}
            onChange={(e) => editingStudent ? setEditingStudent({ ...editingStudent, email: e.target.value }) : setNewStudent({ ...newStudent, email: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            placeholder="Enter Age"
            value={editingStudent ? editingStudent.age : newStudent.age}
            onChange={(e) => editingStudent ? setEditingStudent({ ...editingStudent, age: e.target.value }) : setNewStudent({ ...newStudent, age: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="major">Major:</label>
          <input
            id="major"
            type="text"
            placeholder="Enter Major"
            value={editingStudent ? editingStudent.major : newStudent.major}
            onChange={(e) => editingStudent ? setEditingStudent({ ...editingStudent, major: e.target.value }) : setNewStudent({ ...newStudent, major: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="waitlist">Waitlist:</label>
          <input
            id="waitlist"
            type="checkbox"
            checked={editingStudent ? editingStudent.waitlist : newStudent.waitlist}
            onChange={(e) => editingStudent ? setEditingStudent({ ...editingStudent, waitlist: e.target.checked }) : setNewStudent({ ...newStudent, waitlist: e.target.checked })}
          />
        </div>
        <div className="form-actions">
          {editingStudent ? (
            <>
              <button type="button" className="button" onClick={handleUpdateStudent}>Update Student</button>
              <button type="button" className="button cancel" onClick={() => setEditingStudent(null)}>Cancel</button>
            </>
          ) : (
            <button type="button" className="button" onClick={handleAddStudent}>Add Student</button>
          )}
        </div>
      </form>
    </div>
  );
}
export function StudentList({ students, handleEditStudent, handleDeleteStudent }) {
    return (
      <div className="student-list-container">
        <h1 className="section-title">Students List</h1>
        {students.length > 0 ? (
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Major</th>
                <th>Waitlist</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>{student.major}</td>
                  <td>{student.waitlist ? 'Yes' : 'No'}</td>
                  <td>{student.course_name || 'N/A'}</td>
                  <td className="actions">
                    <button className="button edit" onClick={() => handleEditStudent(student)}>Edit</button>
                    <button className="button delete" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                    <Link to={`/students/${student.id}`}>
                      <button className="button view">View Profile</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No students available.</p>
        )}
      </div>
    );
  }
  