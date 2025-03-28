const request = require('supertest');
const app = require('../path/to/your/app'); 
const db = require('../path/to/your/db'); 

describe('Print Report API', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await db.query('TRUNCATE TABLE students');
    await db.query('TRUNCATE TABLE courses');
    await db.query('TRUNCATE TABLE enrollments');
  });

  describe('GET /:student_id', () => {
    test('should return a printable report for the student', async () => {
      const studentId = 1;
      await db.query('INSERT INTO students (id, name) VALUES (?, ?)', [studentId, 'John Doe']);
      await db.query('INSERT INTO courses (id, name) VALUES (?, ?)', [1, 'Course 1']);
      await db.query('INSERT INTO courses (id, name) VALUES (?, ?)', [2, 'Course 2']);
      await db.query('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [studentId, 1]);
      await db.query('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [studentId, 2]);

      const response = await request(app).get(`/${studentId}`);

      expect(response.status).toBe(200);
      expect(response.text).toContain('Student Name: John Doe');
      expect(response.text).toContain('Course 1');
      expect(response.text).toContain('Course 2');
    });

    test('should return 404 if no student is found', async () => {
      const studentId = 1;

      const response = await request(app).get(`/${studentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Student not found.' });
    });

    test('should return 404 if no courses are found for the student', async () => {
      const studentId = 1;
      await db.query('INSERT INTO students (id, name) VALUES (?, ?)', [studentId, 'John Doe']);

      const response = await request(app).get(`/${studentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'No courses found for this student.' });
    });
  });
});