const request = require('supertest');
const express = require('express');
const adminRoutes = require('../admin');
const jwt = require('jsonwebtoken');
const pool = require('../../db');

jest.mock('../../db');
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockImplementation((token, secret, callback) => {
    callback(null, { id: 1, role: 'admin' });
  }),
}));

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get all students', async () => {
    const mockStudents = [
      { id: 1, name: 'Student 1', email: 's1@example.com', age: 20, major: 'CS', user_id: 101 },
      { id: 2, name: 'Student 2', email: 's2@example.com', age: 21, major: 'EE', user_id: 102 },
    ];
    pool.query.mockResolvedValueOnce([mockStudents]);
    const res = await request(app)
      .get('/admin/students')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockStudents);
  });

  test('should get a specific student', async () => {
    const mockStudent = { id: 1, name: 'Student 1', email: 's1@example.com', age: 20, major: 'CS', user_id: 101 };
    pool.query.mockResolvedValueOnce([[mockStudent]]);
    const res = await request(app)
      .get('/admin/students/1')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockStudent);
  });

  test('should get student details with enrollments and waitlist', async () => {
    const mockStudent = { id: 1, name: 'Student 1', email: 's1@example.com', age: 20, major: 'CS', user_id: 101 };
    const mockEnrolledCourses = [
      { id: 1, name: 'CS101', code: 'CS101', instructor: 'Dr. Smith', schedule: 'Mon 10:00' },
    ];
    const mockWaitlistedCourses = [
      { id: 2, name: 'MATH201', code: 'MATH201', position: 1 },
    ];
    pool.query
      .mockResolvedValueOnce([[mockStudent]])
      .mockResolvedValueOnce([mockEnrolledCourses])
      .mockResolvedValueOnce([mockWaitlistedCourses]);
    const res = await request(app)
      .get('/admin/students/1/details')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      student: mockStudent,
      enrolledCourses: mockEnrolledCourses,
      waitlistedCourses: mockWaitlistedCourses,
    });
  });

  test('should get completed courses for a student', async () => {
    const mockCompletedCourses = [
      {
        completion_date: '2023-01-15T00:00:00.000Z',
        grade: 'A',
        course_id: 1,
        course_name: 'CS101',
        course_code: 'CS101',
        course_instructor: 'Dr. Smith',
        credits: 3,
      },
    ];
    pool.query.mockResolvedValueOnce([mockCompletedCourses]);
    const res = await request(app)
      .get('/admin/students/1/completed-courses')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockCompletedCourses);
  });

  test('should add a new student', async () => {
    const newStudent = { name: 'New Student', email: 'new@example.com', age: 22, major: 'BIO', user_id: 103 };
    pool.query.mockResolvedValueOnce([{ insertId: 3 }]);
    const res = await request(app)
      .post('/admin/students')
      .send(newStudent)
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ id: 3, ...newStudent });
  });

  test('should update a student', async () => {
    const updatedStudent = { name: 'Updated Student', email: 'updated@example.com', age: 23, major: 'CHEM' };
    pool.query
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[{ id: 1, ...updatedStudent, user_id: 101 }]]);
    const res = await request(app)
      .put('/admin/students/1')
      .send(updatedStudent)
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ id: 1, ...updatedStudent, user_id: 101 });
  });

  test('should handle student not found on get', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const res = await request(app)
      .get('/admin/students/999')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Student not found' });
  });

  test('should handle student not found on update', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app)
      .put('/admin/students/999')
      .send({ name: 'Test Student', email: 'test@example.com', age: 20, major: 'CS' })
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Student not found' });
  });

  test('should handle student not found on delete', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app)
      .delete('/admin/students/999')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Student not found' });
  });

  test('should handle course not found on update', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app)
      .put('/admin/courses/999')
      .send({ name: 'Test Course', code: 'TC101' })
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Course not found' });
  });

  test('should handle internal server error on enroll student', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .post('/admin/students/1/enroll')
      .send({ courseCode: 'CS101' })
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });

  test('should handle internal server error on drop student', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .post('/admin/students/1/drop')
      .send({ courseId: 10 })
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });

  test('should handle internal server error on delete student', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .delete('/admin/students/1')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });

  test('should handle internal server error on get courses', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .get('/admin/courses')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Failed to fetch courses data. Please try again later.' });
  });

  test('should handle internal server error on add course', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .post('/admin/courses')
      .send({ name: 'Test Course', code: 'TC101' })
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });

  test('should handle internal server error on update course', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .put('/admin/courses/1')
      .send({ name: 'Test Course', code: 'TC101' })
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });

  test('should handle internal server error on delete course', async () => {
    console.error = jest.fn();
    pool.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .delete('/admin/courses/1')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });
});