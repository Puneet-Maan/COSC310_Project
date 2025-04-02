const request = require('supertest');
const express = require('express');
const profileRoutes = require('../profile');
const jwt = require('jsonwebtoken');
const db = require('../../db');

jest.mock('../../db');
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockImplementation((token, secret, callback) => {
    callback(null, { id: 1, role: 'student' }); // Mock valid user payload
  }),
}));

const app = express();
app.use(express.json());
app.use('/profile', profileRoutes);

describe('Profile Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // No need to close the connection mock if it's not a real connection
    // await db.end();
  });

  test('should get student profile', async () => {
    db.query.mockResolvedValueOnce([[{ id: 1, name: 'Test Student', age: 20, major: 'CS', email: 'test@example.com' }]]);
    const res = await request(app)
      .get('/profile/1')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ id: 1, name: 'Test Student', age: 20, major: 'CS', email: 'test@example.com' });
  });

  test('should update student profile', async () => {
    db.query
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Mock successful update
      .mockResolvedValueOnce([[{ name: 'Updated Student', age: 21, major: 'CS', email: 'updated@example.com' }]]);
    const res = await request(app)
      .put('/profile/1')
      .send({
        name: 'Updated Student',
        age: 21,
        major: 'CS',
        email: 'updated@example.com',
      })
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ name: 'Updated Student', age: 21, major: 'CS', email: 'updated@example.com' });
  });

  test('should get completed courses for a student', async () => {
    const mockCompletedCourses = [
      {
        course_id: 1,
        course_code: 'CS101',
        course_name: 'Intro to CS',
        course_instructor: 'Dr. Smith',
        completion_date: '2023-01-15T00:00:00.000Z',
        grade: 'A',
        credits: 3,
      },
      {
        course_id: 2,
        course_code: 'MATH201',
        course_name: 'Calculus I',
        course_instructor: 'Prof. Johnson',
        completion_date: '2023-05-20T00:00:00.000Z',
        grade: 'B+',
        credits: 4,
      },
    ];

    db.query.mockResolvedValueOnce([mockCompletedCourses]);
    const res = await request(app)
      .get('/profile/1/completed-courses')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockCompletedCourses);
  });

  test('should handle student not found on update', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 0 }]); // Mock student not found
    const res = await request(app)
      .put('/profile/1')
      .send({
        name: 'Updated Student',
        age: 21,
        major: 'CS',
        email: 'updated@example.com',
      })
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Student not found' });
  });

  test('should handle student not found on get', async () => {
    db.query.mockResolvedValueOnce([[]]);
    const res = await request(app)
      .get('/profile/1')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Student not found' });
  });

  test('should handle server error on get', async () => {
    console.error = jest.fn();
    db.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .get('/profile/1')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });

  test('should handle server error on update', async () => {
    console.error = jest.fn();
    db.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .put('/profile/1')
      .send({
        name: 'Updated Student',
        age: 21,
        major: 'CS',
        email: 'updated@example.com',
      })
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Server error' });
  });

  test('should handle duplicate email error on update', async () => {
    const duplicateEmailError = new Error('Duplicate entry \'test@example.com\' for key \'email\'');
    duplicateEmailError.code = 'ER_DUP_ENTRY';
    duplicateEmailError.message = 'Duplicate entry \'test@example.com\' for key \'email\'';

    db.query.mockRejectedValueOnce(duplicateEmailError);

    const res = await request(app)
      .put('/profile/1')
      .send({ name: 'Test Student', age: 20, major: 'CS', email: 'test@example.com' })
      .set('Authorization', 'Bearer validtoken');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'This email address is already in use.' });
  });

  test('should handle server error on get completed courses', async () => {
    console.error = jest.fn();
    db.query.mockRejectedValueOnce(new Error('Database error'));
    const res = await request(app)
      .get('/profile/1/completed-courses')
      .set('Authorization', 'Bearer validtoken');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ message: 'Server error fetching completed courses.' });
  });
});