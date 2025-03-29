import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/globalStyles.css';

const StudentEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState('');
  const { studentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        console.log('Fetching data for student:', studentId);

        const [enrollmentsResponse, studentResponse] = await Promise.all([
          axios.get(`http://localhost:3000/enrollments/student-enrollments/${studentId}`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
          }),
          axios.get(`http://localhost:3000/admin/students/${studentId}`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
          }),
        ]);

        console.log('Enrollments response:', enrollmentsResponse.data);
        console.log('Student response:', studentResponse.data);

        if (Array.isArray(enrollmentsResponse.data)) {
          setEnrollments(enrollmentsResponse.data);
        } else {
          console.error('Invalid enrollments data:', enrollmentsResponse.data);
          setEnrollments([]);
        }

        if (studentResponse.data && studentResponse.data.name) {
          setStudentName(studentResponse.data.name);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError(`Failed to fetch data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const handleUpdateGrade = async (enrollmentId, currentGrade) => {
    const newGrade = prompt('Enter new grade:', currentGrade || '');
    if (newGrade === null) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3000/enrollments/update-grade',
        { enrollment_id: enrollmentId, grade: newGrade },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEnrollments(enrollments.map(enrollment =>
        enrollment.enrollment_id === enrollmentId
          ? { ...enrollment, grade: newGrade }
          : enrollment
      ));

      alert('Grade updated successfully!');
    } catch (err) {
      console.error('Error updating grade:', err);
      alert('Failed to update grade. Please try again.');
    }
  };

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/report/generate',
        { studentName, enrollments },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enrollment_report_${studentName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report. Please try again.');
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-course-list-page">
      <div className="page-header">
        <h1 className="page-title">Enrollments for {studentName}</h1>
        <div className="button-group">
          <button className="btn-primary" onClick={() => navigate('/students')}>
            Back to Students
          </button>
          <button className="btn-report" onClick={handleDownloadReport}>
            Download Report
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Course Code</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.enrollment_id}>
                <td>{enrollment.course_name}</td>
                <td>{enrollment.course_code}</td>
                <td>{enrollment.grade || 'N/A'}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleUpdateGrade(enrollment.enrollment_id, enrollment.grade)}
                  >
                    Update Grade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentEnrollmentsPage;


