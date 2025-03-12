const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');

const app = express();
app.use(userRoutes);

describe('User API Endpoints', () => {
    test('GET /api/searchUsers should return users', async () => {
        const response = await request(app).get('/api/searchUsers?q=John');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/getUser should return user details', async () => {
        const response = await request(app).get('/api/getUser?id=1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('student_number');
    });

    test('GET /api/getUser should return 404 for non-existent user', async () => {
        const response = await request(app).get('/api/getUser?id=999');
        expect(response.status).toBe(404);
    });
});