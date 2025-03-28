const request = require('supertest');
const app = require('../path/to/your/app'); 

describe('Calendar API', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await db.query('TRUNCATE TABLE calendar_events');
    await db.query('TRUNCATE TABLE courses');
  });

  describe('GET /:student_id', () => {
    test('should return all calendar events for the student', async () => {
      const studentId = 1;
      await db.query('INSERT INTO students (id) VALUES (?)', [studentId]);
      await db.query('INSERT INTO courses (id, name) VALUES (?, ?)', [1, 'Course 1']);
      await db.query('INSERT INTO calendar_events (student_id, course_id, event_date, start_time, end_time) VALUES (?, ?, ?, ?, ?)', [studentId, 1, '2022-01-01', '09:00:00', '10:00:00']);

      const response = await request(app).get(`/${studentId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          course_name: 'Course 1',
          event_date: '2022-01-01',
          start_time: '09:00:00',
          end_time: '10:00:00',
        },
      ]);
    });

    test('should return 404 if no events are found for the student', async () => {
      const studentId = 1;
      await db.query('INSERT INTO students (id) VALUES (?)', [studentId]);

      const response = await request(app).get(`/${studentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'No events found for this student.' });
    });
  });
});