const request = require('supertest');
const express = require('express');
const adminRoutes = require('../routes/adminRoutes'); // Adjust the path as needed
const db = require('../db'); // Mock database

jest.mock('../db'); // Mock the database to avoid real DB calls

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin Routes', () => {
  
  // Mock DB Query Implementation
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  /**
   * Test for Creating a Course
   */
  describe('POST /admin/create-course', () => {
    it('should create a course successfully', async () => {
      db.query.mockResolvedValue({ insertId: 1 }); // Mock successful DB response

      const response = await request(app)
        .post('/admin/create-course')
        .send({
          name: 'Introduction to Programming',
          description: 'Learn programming basics',
          instructor: 'Dr. John Doe',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Course created successfully');
      expect(response.body).toHaveProperty('courseId', 1);
    });

    it('should return 400 if any field is missing', async () => {
      const response = await request(app).post('/admin/create-course').send({
        name: 'Incomplete Course',
        description: 'This is missing an instructor',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'All fields are required');
    });

    it('should return 500 on database error', async () => {
      db.query.mockRejectedValue(new Error('Database failure'));

      const response = await request(app)
        .post('/admin/create-course')
        .send({
          name: 'Failed Course',
          description: 'Database error simulation',
          instructor: 'Dr. Error',
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Internal server error');
    });
  });

  /**
   * Test for Updating a User Grade
   */
  describe('PUT /admin/update-grade', () => {
    it('should update user grade successfully', async () => {
      db.query.mockResolvedValue({ affectedRows: 1 });

      const response = await request(app)
        .put('/admin/update-grade')
        .send({
          userId: 10,
          grade: 'A',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Grade updated successfully');
    });

    it('should return 400 if userId or grade is missing', async () => {
      const response = await request(app)
        .put('/admin/update-grade')
        .send({
          userId: 10, // Missing grade
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User ID and grade are required');
    });

    it('should return 404 if user not found', async () => {
      db.query.mockResolvedValue({ affectedRows: 0 });

      const response = await request(app)
        .put('/admin/update-grade')
        .send({
          userId: 99,
          grade: 'B',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 500 on database error', async () => {
      db.query.mockRejectedValue(new Error('Database connection lost'));

      const response = await request(app)
        .put('/admin/update-grade')
        .send({
          userId: 5,
          grade: 'C',
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Internal server error');
    });
  });

});
