const request = require('supertest');
const app = require('../routes/app');
const db = require('../db');

describe('General API', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await db.query('TRUNCATE TABLE courses');
    await db.query('TRUNCATE TABLE students');
    await db.query('TRUNCATE TABLE enrollments');
    await db.query('TRUNCATE TABLE waitlist');
    await db.query('TRUNCATE TABLE notifications');
  });

  describe('GET /', () => {
    test('should return all available courses', async () => {
      await db.query('INSERT INTO courses (name) VALUES (?)', ['Course 1']);
      await db.query('INSERT INTO courses (name) VALUES (?)', ['Course 2']);

      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: expect.any(Number), name: 'Course 1' },
        { id: expect.any(Number), name: 'Course 2' },
      ]);
    });
  });

  describe('GET /enrolled-courses/:student_id', () => {
    test('should return all courses the student is enrolled in', async () => {
      const studentId = 1;
      await db.query('INSERT INTO students (id) VALUES (?)', [studentId]);
      await db.query('INSERT INTO courses (name) VALUES (?)', ['Course 1']);
      await db.query('INSERT INTO courses (name) VALUES (?)', ['Course 2']);
      await db.query('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [studentId, 1]);
      await db.query('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [studentId, 2]);

      const response = await request(app).get(`/enrolled-courses/${studentId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: expect.any(Number), name: 'Course 1' },
        { id: expect.any(Number), name: 'Course 2' },
      ]);
    });
  });

});