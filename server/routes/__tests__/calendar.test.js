const request = require('supertest');
const express = require('express');
const calendarRoutes = require('../calendar');
const pool = require('../../db');

jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/calendar', calendarRoutes);

describe('Calendar Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /calendar/:student_id', () => {
    test('should get calendar events for a student', async () => {
      const mockEvents = [
        {
          course_name: 'CS101',
          event_date: '2023-11-25',
          start_time: '10:00:00',
          end_time: '11:00:00',
        },
        {
          course_name: 'MATH201',
          event_date: '2023-11-26',
          start_time: '14:00:00',
          end_time: '15:30:00',
        },
      ];
      pool.query.mockResolvedValueOnce([mockEvents]);

      const res = await request(app).get('/calendar/1');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockEvents);
    });

    test('should return 404 if no events are found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const res = await request(app).get('/calendar/1');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: 'You are not enrolled in any course.' });
    });

    test('should handle server error', async () => {
      console.error = jest.fn(); // Suppress console.error
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app).get('/calendar/1');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });
});