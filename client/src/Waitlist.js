import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Waitlist() {
  const [studentId, setStudentId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [waitlist, setWaitlist] = useState([]);

  const fetchWaitlist = async (sectionId) => {
    try {
      const response = await axios.get('http://localhost:5001/api/waitlist', { params: { section_id: sectionId } });
      setWaitlist(response.data);
    } catch (err) {
      console.error('Error fetching waitlist data:', err);
    }
  };

  useEffect(() => {
    if (sectionId) {
      fetchWaitlist(sectionId);
    }
  }, [sectionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        fetchWaitlist(sectionId);
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
        <ul>
          {waitlist.map((entry, index) => (
            <li key={index} className="mb-2">
              <p><strong>Student ID:</strong> {entry.student_id}</p>
              <p><strong>Section ID:</strong> {entry.section_id}</p>
              <p><strong>Added At:</strong> {new Date(entry.added_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Waitlist;
