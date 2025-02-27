import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';

const Waitlist = () => {
  const [studentId, setStudentId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [waitlist, setWaitlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:5001/api/waitlist')
      .then(response => {
        setWaitlist(response.data);
      })
      .catch(error => {
        console.error('Error fetching waitlist entries:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { studentId, sectionId };
    axios.post('http://localhost:5001/api/waitlist', newEntry)
      .then(response => {
        setWaitlist([...waitlist, response.data]);
        setStudentId('');
        setSectionId('');
      })
      .catch(error => {
        console.error('Error adding waitlist entry:', error);
      });
  };

  const handleEdit = (index) => {
    const entry = waitlist[index];
    setStudentId(entry.studentId);
    setSectionId(entry.sectionId);
    handleDelete(entry.waitlist_id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/api/waitlist/${id}`)
      .then(() => {
        const newWaitlist = waitlist.filter((entry) => entry.waitlist_id !== id);
        setWaitlist(newWaitlist);
      })
      .catch(error => {
        console.error('Error deleting waitlist entry:', error);
      });
  };

  const filteredWaitlist = waitlist.filter(
    (entry) =>
      entry.studentId.includes(searchTerm) ||
      entry.sectionId.includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWaitlist.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <header>
        <h1>Student Waitlist</h1>
      </header>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Section ID"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            required
          />
          <button type="submit">Add to Waitlist</button>
        </form>
      </div>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by Student ID or Section ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Section ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((entry, index) => (
            <tr key={index}>
              <td>{entry.studentId}</td>
              <td>{entry.sectionId}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(entry.waitlist_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredWaitlist.length / itemsPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Waitlist;
