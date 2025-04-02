const request = require('supertest');
const express = require('express');
const generalRoutes = require('../courses/general');
const pool = require('../../db');

jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/general', generalRoutes);

describe('General Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get all available courses', async () => {
    const mockCourses = [
      { id: 1, name: 'CS101', code: 'CS101', instructor: 'Dr. Smith', schedule: 'Mon 10:00' },
      { id: 2, name: 'MATH201', code: 'MATH201', instructor: 'Prof. Johnson', schedule: 'Tue 14:00' },
    ];
    pool.query.mockResolvedValueOnce([mockCourses]);
    const res = await request(app).get('/general');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockCourses);
  });

  test('should get all courses the student is enrolled in', async () => {
    const mockEnrolledCourses = [
      { id: 1, name: 'CS101', code: 'CS101', instructor: 'Dr. Smith', schedule: 'Mon 10:00' },
    ];
    pool.query.mockResolvedValueOnce([mockEnrolledCourses]);
    const res = await request(app).get('/general/enrolled-courses/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockEnrolledCourses);
  });

  test('should get student profile by ID with enrolled and waitlisted courses', async () => {
    const mockStudent = { id: 1, name: 'Student 1', email: 's1@example.com', age: 20, major: 'CS' };
    const mockEnrolledCourses = [{ id: 1, name: 'CS101', code: 'CS101', instructor: 'Dr. Smith', schedule: 'Mon 10:00' }];
    const mockWaitlistedCourses = [{ id: 2, name: 'MATH201', code: 'MATH201', instructor: 'Prof. Johnson', schedule: 'Tue 14:00' }];
    pool.query
      .mockResolvedValueOnce([[mockStudent]])
      .mockResolvedValueOnce([mockEnrolledCourses])
      .mockResolvedValueOnce([mockWaitlistedCourses]);
    const res = await request(app).get('/general/students/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      student: mockStudent,
      enrolledCourses: mockEnrolledCourses,
      waitlistedCourses: mockWaitlistedCourses,
    });
  });

  test('should get all students with waitlist details', async () => {
    const mockStudents = [
      { id: 1, name: 'Student 1', email: 's1@example.com', age: 20, major: 'CS', waitlist_status: 'Yes', course_name: 'MATH201' },
      { id: 2, name: 'Student 2', email: 's2@example.com', age: 21, major: 'EE', waitlist_status: 'No', course_name: null },
    ];
    pool.query.mockResolvedValueOnce([mockStudents]);
    const res = await request(app).get('/general/students');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockStudents);
  });

  test('should get notifications for a student', async () => {
    const mockNotifications = [
      { id: 1, student_id: 1, message: 'Class CS101 is starting soon!' },
      { id: 2, student_id: 1, message: 'Your waitlist position for MATH201 is now 1.' },
    ];
    pool.query.mockResolvedValueOnce([mockNotifications]);
    const res = await request(app).get('/general/notifications/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockNotifications);
  });

  test('should delete a notification by ID', async () => {
    pool.query.mockResolvedValueOnce([{ id: 1, student_id: 1, message: 'Test notification' }]);
    pool.query.mockResolvedValueOnce([]);
    const res = await request(app).delete('/general/notifications/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Notification deleted successfully' });
  });

  test('should handle student not found', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/general/students/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Student not found' });
  });

  test('should handle server error on get courses', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app).get('/general');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });

  test('should handle server error on get enrolled courses', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app).get('/general/enrolled-courses/1');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });

  test('should handle server error on get student profile', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app).get('/general/students/1');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });

  test('should handle server error on get students with waitlist', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app).get('/general/students');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });

  test('should handle server error on get notifications', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app).get('/general/notifications/1');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });

  test('should handle server error on delete notification', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app).delete('/general/notifications/1');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Failed to delete notification. Please try again.' });
  });
});