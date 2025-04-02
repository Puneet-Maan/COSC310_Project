const request = require('supertest');
const express = require('express');
const enrollmentRoutes = require('../courses/enrollment');
const db = require('../../db');
const { convertTo24Hour, getNextDayOfWeek } = require('../courses/utils');

jest.mock('../../db');
jest.mock('../courses/utils');

const app = express();
app.use(express.json());
app.use('/enrollment', enrollmentRoutes);

describe('Enrollment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should enroll a student in a course', async () => {
    const courseData = [[{ capacity: 30, enrolled: 20, schedule: 'Mon/Wed 10:00 AM - 11:00 AM' }]];
    db.query
      .mockResolvedValueOnce(courseData) // Check course details
      .mockResolvedValueOnce([[]]) // Check if the student is already enrolled
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Enroll the student
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update course enrollment

    convertTo24Hour.mockImplementation((time) => time);
    getNextDayOfWeek.mockImplementation((day) => `2025-04-0${day === 'Mon' ? '7' : '9'}`);

    const res = await request(app)
      .post('/enrollment/enroll')
      .send({ student_id: 1, course_id: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Enrollment successful');
    expect(res.body.waitlisted).toBe(false);
  });

  test('should add a student to the waitlist if the course is full', async () => {
    const courseData = [[{ capacity: 30, enrolled: 30, schedule: 'Mon/Wed 10:00 AM - 11:00 AM' }]];
    db.query
      .mockResolvedValueOnce(courseData) // Check course details
      .mockResolvedValueOnce([[{ maxPosition: 1 }]]) // Get last waitlist position
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // Add to waitlist

    const res = await request(app)
      .post('/enrollment/enroll')
      .send({ student_id: 1, course_id: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('You have been added to the waitlist.');
    expect(res.body.waitlisted).toBe(true);
  });

  test('should drop a course and notify the next student in the waitlist', async () => {
    db.query
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Remove enrollment
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course enrollment
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Remove calendar events
      .mockResolvedValueOnce([[{ student_id: 2, name: 'Test Course', schedule: 'Mon/Wed 10:00 AM - 11:00 AM' }]]) // Get next student in waitlist
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Remove from waitlist
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // Create notification

    const res = await request(app)
      .post('/enrollment/drop')
      .send({ student_id: 1, course_id: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Course dropped successfully.');
  });
});