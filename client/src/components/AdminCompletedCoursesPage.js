import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload, faCaretDown, faCheckCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';

const AdminCompletedCoursesPage = () => {
  const { studentId } = useParams();
  const [allCompletedCourses, setAllCompletedCourses] = useState([]);
  const [filterTerm, setFilterTerm] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [exportFormat, setExportFormat] = useState('');

  const getSessionFromDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth();
    const year = date.getFullYear();
    if (month >= 0 && month <= 4) {
      return `Winter ${year}`;
    } else if (month >= 5 && month <= 7) {
      return `Summer ${year}`;
    } else {
      return `Fall ${year}`;
    }
  };

  const filteredCourses = useMemo(() => {
    if (!filterTerm) {
      return allCompletedCourses;
    }
    const lowerFilterTerm = filterTerm.toLowerCase();
    return allCompletedCourses.filter(course => {
      const session = getSessionFromDate(course.completion_date).toLowerCase();
      return (
        course.course_code.toLowerCase().includes(lowerFilterTerm) ||
        course.course_name.toLowerCase().includes(lowerFilterTerm) ||
        course.course_instructor.toLowerCase().includes(lowerFilterTerm) ||
        session.includes(lowerFilterTerm) ||
        (course.grade && course.grade.toLowerCase().includes(lowerFilterTerm))
      );
    });
  }, [filterTerm, allCompletedCourses, getSessionFromDate]);

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }
        const studentResponse = await fetch(`http://localhost:3000/admin/students/${studentId}`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, }, });
        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          setStudentName(studentData.name);
          setStudentEmail(studentData.email);
        } else {
          const errorData = await studentResponse.json();
          setError(`Error fetching student. Status: ${studentResponse.status}, Message: ${JSON.stringify(errorData)}`);
          setLoading(false);
          return;
        }
        const completedCoursesResponse = await fetch(
          `http://localhost:3000/admin/students/${studentId}/completed-courses`,
          { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, }, }
        );
        if (completedCoursesResponse.ok) {
          const completedCoursesData = await completedCoursesResponse.json();
          setAllCompletedCourses(completedCoursesData);
        } else {
          const errorData = await completedCoursesResponse.json();
          setError(`Failed to fetch courses. Status: ${completedCoursesResponse.status}, Message: ${JSON.stringify(errorData)}`);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedCourses();
  }, [studentId]);

  const handleExport = (format) => {
    setExportFormat(format);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (exportFormat && allCompletedCourses.length > 0 && studentName) {
      const reportData = filteredCourses.map(course => ({
        'Course Code': course.course_code,
        'Course Name': course.course_name,
        'Instructor': course.course_instructor,
        'Credits': course.credits || 'N/A',
        'Completed': getSessionFromDate(course.completion_date),
        'Grade': course.grade || 'N/A',
      }));
      const fileName = `${studentName.replace(/\s+/g, '_')}_completed_courses_report`;
      const reportTitle = `${studentName}'s Academic Transcript`;
      const additionalDetails = [
        [`Student Name:`, studentName],
        [`Student Email:`, studentEmail],
        [`Filter Applied:`, filterTerm || 'None'],
        [`Report Generated:`, new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' })],
      ];

      if (exportFormat === 'pdf') {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(reportTitle, 14, 20);
        doc.setFontSize(10);
        let yPosition = 30;
        additionalDetails.forEach(([label, value]) => {
          doc.text(`${label} ${value}`, 14, yPosition);
          yPosition += 5;
        });
        yPosition += 10;
        doc.autoTable({
          startY: yPosition,
          head: [['Course Code', 'Course Name', 'Instructor', 'Credits', 'Completed', 'Grade']],
          body: reportData.map(item => Object.values(item)),
        });
        doc.save(`${fileName}.pdf`);
      } else if (exportFormat === 'excel') {
        const worksheetData = [
          [reportTitle],
          [],
          ...additionalDetails.map(([label, value]) => [label, value]),
          [],
          ['Course Code', 'Course Name', 'Instructor', 'Credits', 'Completed', 'Grade'],
          ...reportData.map(item => Object.values(item)),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Completed Courses');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      }
      setExportFormat('');
    }
  }, [exportFormat, filteredCourses, studentName, studentEmail, filterTerm, getSessionFromDate]);

  const csvData = useMemo(() => {
    if (filteredCourses.length > 0 && studentName) {
      return [
        [`${studentName}'s Academic Transcript`],
        [],
        [`Student Name:`, studentName],
        [`Student Email:`, studentEmail],
        [`Filter Applied:`, filterTerm || 'None'],
        [`Report Generated:`, new Date().toLocaleString()],
        [],
        ['Course Code', 'Course Name', 'Instructor', 'Credits', 'Completed', 'Grade'],
        ...filteredCourses.map(course => [
          course.course_code,
          course.course_name,
          course.course_instructor,
          course.credits || 'N/A',
          getSessionFromDate(course.completion_date),
          course.grade || 'N/A',
        ]),
      ];
    }
    return [];
  }, [filteredCourses, studentName, studentEmail, filterTerm, getSessionFromDate]);

  const csvFileName = `${studentName.replace(/\s+/g, '_')}_completed_courses_report.csv`;

  const handleFilterChange = (e) => {
    setFilterTerm(e.target.value);
  };

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Completed Courses</h1>
      {studentName && (
        <div className="student-info-header">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faCheckCircle} className="section-icon" /> {studentName}'s Courses
          </h2>
        </div>
      )}

      <div className="academic-info-section">
        <h3>Filter Courses</h3>
        <div className="academic-info-form">
          <label htmlFor="filterTerm">Search Courses:</label>
          <input
            type="text"
            id="filterTerm"
            value={filterTerm}
            onChange={handleFilterChange}
            placeholder="Enter code, name, instructor, or session"
          />
        </div>
      </div>

      <div className="button-container">
        <button className="btn-primary" onClick={() => navigate(`/students/${studentId}`)}>
          <FontAwesomeIcon icon={faArrowLeft} className="button-icon" /> Back
        </button>
        <div className="export-dropdown">
          <button className="btn-primary" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faDownload} className="button-icon" /> Export <FontAwesomeIcon icon={faCaretDown} />
          </button>
          {isDropdownOpen && (
            <div className="export-dropdown-menu" ref={dropdownRef}>
              <button className="export-dropdown-item" onClick={() => handleExport('pdf')}>
                <FontAwesomeIcon icon={faDownload} className="dropdown-icon" /> PDF Report
              </button>
              <button className="export-dropdown-item" onClick={() => handleExport('excel')}>
                <FontAwesomeIcon icon={faDownload} className="dropdown-icon" /> Excel Report
              </button>
              <CSVLink
                data={csvData}
                filename={csvFileName}
                className="export-dropdown-item"
                target="_blank"
              >
                <FontAwesomeIcon icon={faDownload} className="dropdown-icon" /> CSV Report
              </CSVLink>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredCourses.length > 0 ? (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr><th>Code</th><th>Name</th><th>Instructor</th><th>Credits</th><th>Completed</th><th>Grade</th></tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.course_id}>
                  <td>{course.course_code}</td>
                  <td>{course.course_name}</td>
                  <td>{course.course_instructor}</td>
                  <td>{course.credits || 'N/A'}</td>
                  <td>{getSessionFromDate(course.completion_date)}</td>
                  <td>{course.grade || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data-message">{filterTerm ? `No courses matching "${filterTerm}" found for ${studentName}.` : `No completed courses for ${studentName}.`}</p>
      )}
    </div>
  );
};

export default AdminCompletedCoursesPage;