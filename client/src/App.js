import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; 
import Login from './components/Login';
import StudentHome from './components/StudentHome';
import CoursesList from './components/CoursesList';
import EnrolledCourses from './components/EnrolledCourses';
import EditProfile from './components/EditProfile';
import NotificationsPage from './components/NotificationsPage';
import Calendar from './components/Calendar';
import NavBar from './components/NavBar';
import AdminHome from './components/AdminHome';
import AdminStudentListPage from './components/AdminStudentListPage';
import AdminCourseListPage from './components/AdminCourseListPage';
import AdminWaitlistPage from './components/AdminWaitlistPage';
import AdminStudentProfilePage from './components/AdminStudentProfilePage';
import AdminStudentEnrollmentsPage from './components/AdminStudentEnrollmentsPage';

// Import the global CSS file
import './styles/globalStyles.css'; // Ensure the correct path to your CSS file

function App() {
  const [theme, setTheme] = useState('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [notificationCount, setNotificationCount] = useState(0);
  const [userRole, setUserRole] = useState('');
  const location = useLocation(); 

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Optionally save theme in localStorage
  };

  useEffect(() => {
    // Get saved theme from localStorage if exists
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const fetchNotificationCount = async (studentId) => {
      try {
        const response = await fetch(`http://localhost:3000/courses/notifications/${studentId}`);
        const data = await response.json();
        setNotificationCount(data.length);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const studentId = decodedToken.id;
    fetchNotificationCount(studentId);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <>
      {/* Global Styles are already applied by CSS import */}
      
      {isLoggedIn && (
        <NavBar
          theme={theme}
          toggleTheme={toggleTheme}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          notificationCount={notificationCount}
        />
      )}

      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/home" element={<StudentHome theme={theme} />} />
        <Route path="/courses" element={<CoursesList theme={theme} />} />
        <Route path="/enrolled" element={<EnrolledCourses theme={theme} />} />
        <Route path="/edit-profile" element={<EditProfile theme={theme} />} />
        <Route path="/notifications" element={<NotificationsPage theme={theme} />} />
        <Route path="/calendar" element={<Calendar theme={theme} />} />
        <Route path="/admin" element={<AdminHome theme={theme} />} />
        <Route path="/students" element={<AdminStudentListPage theme={theme} />} />
        <Route path="/course-list" element={<AdminCourseListPage theme={theme} />} />
        <Route path="/waitlist" element={<AdminWaitlistPage theme={theme} />} />
        <Route path="/students/:studentId" element={<AdminStudentProfilePage theme={theme} />} />
        <Route path="/admin/students/:studentId/enrollments" element={<AdminStudentEnrollmentsPage />} />
      </Routes>
    </>
  );
}

export default App;
