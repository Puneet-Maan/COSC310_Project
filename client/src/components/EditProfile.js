import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faDownload, faEdit, faBirthdayCake, faBook, faCheckCircle, faFileExport, faCaretDown, faSearch, faLock, faIdCard } from '@fortawesome/free-solid-svg-icons'; // Added faIdCard
import '../styles/globalStyles.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';

function EditProfile() {
  const [profile, setProfile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({ name: '', age: '', major: '', email: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [filterTerm, setFilterTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [exportFormat, setExportFormat] = useState('');
  const [coursesError, setCoursesError] = useState(null);
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const dividerStyle = { border: '0', height: '1px', background: '#ccc', margin: '20px 0' };
  const darkModeDividerStyle = { ...dividerStyle, background: '#555' };
  const isDarkMode = localStorage.getItem('theme') === 'dark';
  const currentDividerStyle = isDarkMode ? darkModeDividerStyle : dividerStyle;

  const getSessionFromDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth();
    const year = date.getFullYear();
    if (month >= 0 && month <= 4) return `Winter ${year}`;
    if (month >= 5 && month <= 7) return `Summer ${year}`;
    return `Fall ${year}`;
  };

  const filteredCourses = useMemo(() => {
    if (!filterTerm) return completedCourses;
    const lowerFilterTerm = filterTerm.toLowerCase();
    return completedCourses.filter(course => {
      const session = getSessionFromDate(course.completion_date).toLowerCase();
      return (
        course.course_code.toLowerCase().includes(lowerFilterTerm) ||
        course.course_name.toLowerCase().includes(lowerFilterTerm) ||
        course.course_instructor.toLowerCase().includes(lowerFilterTerm) ||
        session.includes(lowerFilterTerm) ||
        (course.grade && course.grade.toLowerCase().includes(lowerFilterTerm))
      );
    });
  }, [filterTerm, completedCourses, getSessionFromDate]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setMessage('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('You are not logged in.');
          setLoadingProfile(false);
          return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const studentId = decodedToken.id;

        const profileResponse = await fetch(`http://localhost:3000/profile/${studentId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
          setUpdatedProfile(profileData);
        } else {
          setMessage('Failed to load profile data.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Network error. Please check your connection.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      setLoadingCourses(true);
      setCoursesError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCoursesError('You are not logged in.');
          setLoadingCourses(false);
          return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const studentId = decodedToken.id;

        const coursesResponse = await fetch(`http://localhost:3000/profile/${studentId}/completed-courses`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          setCompletedCourses(coursesData);
        } else {
          const errorData = await coursesResponse.json();
          setCoursesError(`Failed to load completed courses. Status: ${coursesResponse.status}, Message: ${JSON.stringify(errorData)}`);
        }
      } catch (error) {
        console.error('Error fetching completed courses:', error);
        setCoursesError('Network error loading completed courses.');
      } finally {
        setLoadingCourses(false);
      }
    };

    if (profile) {
      fetchCompletedCourses();
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const studentId = decodedToken.id;
      const response = await fetch(`http://localhost:3000/profile/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updatedProfile),
      });
      if (response.ok) {
        setMessage('Profile updated successfully!');
        setProfile(updatedProfile);
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Network error. Please check your connection.');
    }
  };

  const handleCancel = () => {
    setUpdatedProfile(profile);
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setPasswordUpdateMessage('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') setCurrentPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmNewPassword') setConfirmNewPassword(value);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordUpdateMessage('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const studentId = decodedToken.id;
      const response = await fetch(`http://localhost:3000/auth/profile/${studentId}/update-password`, { // Updated URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordUpdateMessage(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(closePasswordModal, 2000); // Close modal after successful update
      } else {
        setPasswordUpdateMessage(data.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordUpdateMessage('Network error updating password.');
    }
  };

  const handleFilterChange = (e) => {
    setFilterTerm(e.target.value);
  };

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
    if (exportFormat && completedCourses.length > 0 && profile?.name && profile?.email) {
      const reportData = filteredCourses.map(course => ({
        'Course Code': course.course_code,
        'Course Name': course.course_name,
        'Instructor': course.course_instructor,
        'Credits': course.credits || 'N/A',
        'Completed': getSessionFromDate(course.completion_date),
        'Grade': course.grade || 'N/A',
      }));
      const fileName = `${profile.name.replace(/\s+/g, '_')}_completed_courses_report`;
      const reportTitle = `${profile.name}'s Academic Transcript`;
      const additionalDetails = [
        [`Student Name:`, profile.name],
        [`Student Email:`, profile.email],
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
  }, [exportFormat, filteredCourses, profile?.name, profile?.email, filterTerm, getSessionFromDate]);

  const csvData = useMemo(() => {
    if (filteredCourses.length > 0 && profile?.name && profile?.email) {
      return [
        [`${profile.name}'s Academic Transcript`],
        [],
        [`Student Name:`, profile.name],
        [`Student Email:`, profile.email],
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
  }, [filteredCourses, profile?.name, profile?.email, filterTerm, getSessionFromDate]);

  const csvFileName = `${profile?.name?.replace(/\s+/g, '_') || 'completed_courses'}_report.csv`;

  if (loadingProfile || loadingCourses) {
    return <div className="loading-spinner">Loading profile and completed courses...</div>;
  }

  if (message.startsWith('You are not logged in') || coursesError?.startsWith('You are not logged in')) {
    return <div className="error-message">{message || coursesError}</div>;
  }

  if (!profile) {
    return <div className="error-message">Could not load profile information.</div>;
  }

  return (
    <div className={`admin-course-list-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1 className="page-title">
        <FontAwesomeIcon icon={faUser} className="page-icon" /> Your Profile
      </h1>

      {message && message !== 'Profile updated successfully!' && <div className="error-message">{message}</div>}
      {message === 'Profile updated successfully!' && <div className="success-message">{message}</div>}

      <div className="profile-details-container">
  <h2 className="section-title">Student Information</h2>
  <div className="profile-info-grid">
    <div className="info-item">
      <FontAwesomeIcon icon={faUser} className="info-icon" />
      <strong>ID:</strong>
      <span>{profile.id}</span>
    </div>
    <div className="info-item">
      <FontAwesomeIcon icon={faUser} className="info-icon" />
      <strong>Name:</strong>
      <span>{profile.name}</span>
    </div>
    <div className="info-item">
      <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
      <strong>Email:</strong>
      <span>{profile.email}</span>
    </div>
    <div className="info-item">
      <FontAwesomeIcon icon={faBirthdayCake} className="info-icon" />
      <strong>Age:</strong>
      <span>{profile.age}</span>
    </div>
    <div className="info-item">
      <FontAwesomeIcon icon={faBook} className="info-icon" />
      <strong>Major:</strong>
      <span>{profile.major}</span>
    </div>
  </div>
  <div className="profile-actions">
    <button onClick={openModal} className="edit-button">
      <FontAwesomeIcon icon={faEdit} className="button-icon" /> Edit Profile
    </button>
    <button onClick={openPasswordModal} className="password-button">
      <FontAwesomeIcon icon={faLock} className="button-icon" /> Change Password
    </button>
  </div>
</div>

      <hr style={currentDividerStyle} />

      <div className="academic-info-section">
        <h3><FontAwesomeIcon icon={faSearch} className="section-icon" /> Filter Completed Courses</h3>
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
        <div className="export-dropdown">
          <button className="btn-primary" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faDownload} className="button-icon" /> Export Transcript <FontAwesomeIcon icon={faCaretDown} />
          </button>
          {isDropdownOpen && (
            <div className="export-dropdown-menu" ref={dropdownRef}>
              <button className="export-dropdown-item" onClick={() => handleExport('pdf')}>
<FontAwesomeIcon icon={faDownload} className="dropdown-icon" /> PDF
</button>
<button className="export-dropdown-item" onClick={() => handleExport('excel')}>
<FontAwesomeIcon icon={faDownload} className="dropdown-icon" />Excel
</button>
<CSVLink
data={csvData}
filename={csvFileName}
className="export-dropdown-item"
target="_blank"
>
<FontAwesomeIcon icon={faDownload} className="dropdown-icon" /> CSV
</CSVLink>
</div>
)}
</div>
</div>

  <div className="table-container">
    <h2 className="section-title">
      <FontAwesomeIcon icon={faCheckCircle} className="section-icon" /> Completed Courses
    </h2>
    {coursesError && <div className="error-message">{coursesError}</div>}
    {filteredCourses.length > 0 ? (
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
    ) : (
      <p className="no-data-message">{filterTerm ? `No completed courses matching "${filterTerm}" found.` : 'No completed courses yet.'}</p>
    )}
  </div>

  {isModalOpen && (
    <div className="modal">
      <div className="modal-form">
        <h2>Edit Profile</h2>
        <form>
          <table className="profile-form-table">
            <tbody>
              <tr>
                <td><label htmlFor="name">Name:</label></td>
                <td>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={updatedProfile.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your name"
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="email">Email:</label></td>
                <td>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={updatedProfile.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="age">Age:</label></td>
                <td>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    value={updatedProfile.age}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your age"
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="major">Major:</label></td>
                <td>
                  <input
                    type="text"
                    name="major"
                    id="major"
                    value={updatedProfile.major}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your major"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="button-container">
            <button
              type="button"
              onClick={handleUpdateProfile}
              className="btn-primary"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {isPasswordModalOpen && (
    <div className="modal">
      <div className="modal-form">
        <h2>Change Password</h2>
        {passwordUpdateMessage && (
          <div className={passwordUpdateMessage.startsWith('Success') ? 'success-message' : 'error-message'}>
            {passwordUpdateMessage}
          </div>
        )}
        <form>
          <table className="profile-form-table">
            <tbody>
              <tr>
                <td><label htmlFor="currentPassword">Current Password:</label></td>
                <td>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Enter current password"
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="newPassword">New Password:</label></td>
                <td>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Enter new password"
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="confirmNewPassword">Confirm New Password:</label></td>
                <td>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="button-container">
            <button
              type="button"
              onClick={handleUpdatePassword}
              className="btn-primary"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={closePasswordModal}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
);
}

export default EditProfile;