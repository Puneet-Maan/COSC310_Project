const request = require('supertest');
const express = require('express');
const authRoutes = require('../auth');
const pool = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

const jwtSecret = 'your_jwt_secret';

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    test('should register a new user', async () => {
      bcrypt.hash.mockResolvedValue('hashedPassword');
      pool.query
        .mockResolvedValueOnce([[]]) // No existing user
        .mockResolvedValueOnce([{ insertId: 1 }]) // Insert user
        .mockResolvedValueOnce([{ insertId: 1 }]); // Insert student

      const res = await request(app)
        .post('/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', age: 20, major: 'CS', username: 'testuser', password: 'password' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Registration successful! You can now log in.');
    });

    test('should return 409 if username or email already exists', async () => {
      pool.query.mockResolvedValueOnce([[{ id: 1 }]]); // Existing user

      const res = await request(app)
        .post('/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', age: 20, major: 'CS', username: 'testuser', password: 'password' });

      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toEqual('Username or email already exists.');
    });

    test('should return 500 on database error', async () => {
      console.error = jest.fn(); // Suppress console.error
      pool.query.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', age: 20, major: 'CS', username: 'testuser', password: 'password' });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Error during registration. Please try again later.');
    });
  });

  describe('POST /login', () => {
    test('should login a user with correct credentials', async () => {
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedToken');
      pool.query.mockResolvedValueOnce([[{ id: 1, username: 'testuser', password: 'hashedPassword', role: 'student' }]]);

      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'password' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual('Login successful');
      expect(res.body.token).toEqual('mockedToken');
    });

    test('should return 401 with incorrect password', async () => {
      bcrypt.compare.mockResolvedValue(false);
      pool.query.mockResolvedValueOnce([[{ id: 1, username: 'testuser', password: 'hashedPassword', role: 'student' }]]);

      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toEqual(false);
      expect(res.body.message).toEqual('Invalid credentials');
    });

    test('should return 401 with incorrect username', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'wronguser', password: 'password' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toEqual(false);
      expect(res.body.message).toEqual('Invalid credentials');
    });

    test('should return 500 on database error during login', async () => {
      console.error = jest.fn(); // Suppress console.error
      pool.query.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'password' });

      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toEqual(false);
      expect(res.body.message).toEqual('Server error');
    });
  });
});