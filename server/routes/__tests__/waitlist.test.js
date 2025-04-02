const request = require('supertest');
const express = require('express');
const waitlistRoutes = require('../courses/waitlist');
const pool = require('../../db');

jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/waitlist', waitlistRoutes);

describe('Waitlist Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /waitlisted-students', () => {
    test('should get all waitlisted students with course details', async () => {
      const mockWaitlistedStudents = [
        {
          student_id: 1,
          course_id: 101,
          student_name: 'Student 1',
          email: 's1@example.com',
          age: 20,
          major: 'CS',
          position: 1,
          course_name: 'CS101',
          course_code: 'CS101',
          instructor: 'Dr. Smith',
          schedule: 'Mon 10:00',
        },
        {
          student_id: 2,
          course_id: 102,
          student_name: 'Student 2',
          email: 's2@example.com',
          age: 21,
          major: 'EE',
          position: 2,
          course_name: 'EE201',
          course_code: 'EE201',
          instructor: 'Prof. Johnson',
          schedule: 'Tue 14:00',
        },
      ];
      pool.query.mockResolvedValueOnce([mockWaitlistedStudents]);

      const res = await request(app).get('/waitlist/waitlisted-students');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockWaitlistedStudents);
    });

    test('should handle server error', async () => {
      console.error = jest.fn();
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/waitlist/waitlisted-students');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('GET /waitlisted-courses/:student_id', () => {
    test('should get all waitlisted courses for a student', async () => {
      const mockWaitlistedCourses = [
        { id: 101, name: 'CS101', code: 'CS101', instructor: 'Dr. Smith', schedule: 'Mon 10:00' },
        { id: 102, name: 'EE201', code: 'EE201', instructor: 'Prof. Johnson', schedule: 'Tue 14:00' },
      ];
      pool.query.mockResolvedValueOnce([mockWaitlistedCourses]);

      const res = await request(app).get('/waitlist/waitlisted-courses/1');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockWaitlistedCourses);
    });

    test('should handle server error', async () => {
      console.error = jest.fn();
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/waitlist/waitlisted-courses/1');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('POST /remove-waitlist', () => {
    test('should remove a student from the waitlist', async () => {
      pool.query.mockResolvedValueOnce([]);

      const res = await request(app)
        .post('/waitlist/remove-waitlist')
        .send({ student_id: 1, course_id: 101 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: 'You have been removed from the waitlist.' });
    });

    test('should handle server error', async () => {
      console.error = jest.fn();
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app)
        .post('/waitlist/remove-waitlist')
        .send({ student_id: 1, course_id: 101 });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });
});