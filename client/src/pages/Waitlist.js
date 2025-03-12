import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Waitlist() {
  const [studentId, setStudentId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [waitlist, setWaitlist] = useState([]);
  const [filteredWaitlist, setFilteredWaitlist] = useState([]);

  const fetchWaitlist = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/waitlist');
      console.log('Fetched waitlist data:', response.data);
      setWaitlist(response.data);
      setFilteredWaitlist(response.data); // Initially set filteredWaitlist to all waitlist entries
    } catch (err) {
      console.error('Error fetching waitlist data:', err);
      setError('Error fetching waitlist data');
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!studentId || !sectionId) {
      setError('Student ID and Section ID are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/waitlist', { student_id: studentId, section_id: sectionId }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        setSuccess(true);
        fetchWaitlist(); // Refresh the waitlist
        setStudentId('');
        setSectionId('');
      } else {
        setError(`Registration failed: ${response.data.error}`);
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError(`An error occurred: ${err.response ? err.response.data.error : err.message}`);
    }
  };

  const handleRemove = async (studentId, sectionId) => {
    try {
      const response = await axios.delete('http://localhost:5001/api/waitlist', {
        data: { student_id: studentId, section_id: sectionId }
      });
      if (response.data.success) {
        setSuccess(true);
        fetchWaitlist(); // Refresh the waitlist
      } else {
        setError(`Failed to remove student from the waitlist: ${response.data.error}`);
      }
    } catch (err) {
      console.error('Error removing student from waitlist:', err);
      setError(`An error occurred: ${err.response ? err.response.data.error : err.message}`);
    }
  };

  const handleSearch = () => {
    const filtered = waitlist.filter((entry) =>
      entry.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.section_id.toString().includes(searchTerm.toLowerCase())
    );
    setFilteredWaitlist(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <h2 className="text-4xl font-bold mb-8">Join the Waitlist</h2>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mb-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Successfully added to the waitlist</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="studentId" className="block text-gray-700">Student ID:</label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sectionId" className="block text-gray-700">Section ID:</label>
            <input
              type="text"
              id="sectionId"
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mb-4"
          >
            Join Waitlist
          </button>
        </form>
      </div>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Current Waitlist</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Search
        </button>
        <ul>
          {filteredWaitlist.map((entry, index) => (
            <li key={index} className="mb-2">
              <p><strong>Student ID:</strong> {entry.student_id}</p>
              <p><strong>Section ID:</strong> {entry.section_id}</p>
              <p><strong>Added At:</strong> {new Date(entry.added_at).toLocaleString()}</p>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 mt-2"
                onClick={() => handleRemove(entry.student_id, entry.section_id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Waitlist;
