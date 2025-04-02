const request = require('supertest');
const express = require('express');
const gradesRoutes = require('../grades');
const pool = require('../../db');

jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/grades', gradesRoutes);

describe('Grades Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should record a passing grade and update enrollment', async () => {
    const mockConnection = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
      execute: jest.fn()
        .mockResolvedValueOnce([[{ id: 1 }]]) // Mock enrollment check
        .mockResolvedValueOnce([]) // Mock completed_courses insert
        .mockResolvedValueOnce([]) // Mock enrollments delete
        .mockResolvedValueOnce([]), // Mock courses update
    };

    pool.getConnection.mockResolvedValueOnce(mockConnection);

    const res = await request(app)
      .post('/grades')
      .send({ studentId: 1, courseId: 1, grade: 'A' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Grade recorded, course marked as completed, removed from enrollments, and enrolled count updated.');
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });

  test('should return 400 for invalid grade format', async () => {
    const res = await request(app)
      .post('/grades')
      .send({ studentId: 1, courseId: 1, grade: 'Z' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('Invalid grade format.');
  });

  test('should return 400 if enrollment is not found', async () => {
    const mockConnection = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
      execute: jest.fn()
        .mockResolvedValueOnce([[]]) // Mock enrollment not found
    };

    pool.getConnection.mockResolvedValueOnce(mockConnection);

    const res = await request(app)
      .post('/grades')
      .send({ studentId: 1, courseId: 1, grade: 'A' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Enrollment not found for this student and course.');
    expect(mockConnection.rollback).toHaveBeenCalled();
  });

  test('should handle database error', async () => {
    console.error = jest.fn(); // Suppress console.error
    const mockConnection = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
      execute: jest.fn().mockRejectedValueOnce(new Error('Database error'))
    };

    pool.getConnection.mockResolvedValueOnce(mockConnection);

    const res = await request(app)
      .post('/grades')
      .send({ studentId: 1, courseId: 1, grade: 'A' });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual('Failed to record grade and/or update enrollment.');
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});