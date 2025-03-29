import React from 'react';
import { Link } from 'react-router-dom';

export function StudentForm({ newStudent, setNewStudent, handleAddStudent, editingStudent, setEditingStudent, handleUpdateStudent }) {
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDOBChange = (e) => {
    const dob = e.target.value;
    const age = calculateAge(dob);
    if (editingStudent) {
      setEditingStudent({ ...editingStudent, dob, age });
    } else {
      setNewStudent({ ...newStudent, dob, age });
    }
  };

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
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, id: e.target.value })
                : setNewStudent({ ...newStudent, id: e.target.value })
            }
          />
        </div>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            placeholder="Enter Name"
            value={editingStudent ? editingStudent.name : newStudent.name}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, name: e.target.value })
                : setNewStudent({ ...newStudent, name: e.target.value })
            }
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Enter Email"
            value={editingStudent ? editingStudent.email : newStudent.email}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, email: e.target.value })
                : setNewStudent({ ...newStudent, email: e.target.value })
            }
          />
        </div>
        <div className="form-field">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            id="dob"
            type="date"
            value={editingStudent ? editingStudent.dob : newStudent.dob}
            onChange={handleDOBChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="waitlist">Waitlist:</label>
          <input
            id="waitlist"
            type="checkbox"
            checked={editingStudent ? editingStudent.waitlist : newStudent.waitlist}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, waitlist: e.target.checked })
                : setNewStudent({ ...newStudent, waitlist: e.target.checked })
            }
          />
        </div>
        <div className="form-actions">
          {editingStudent ? (
            <>
              <button type="button" className="button" onClick={handleUpdateStudent}>
                Update Student
              </button>
              <button type="button" className="button cancel" onClick={() => setEditingStudent(null)}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className="button" onClick={handleAddStudent}>
              Add Student
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
  