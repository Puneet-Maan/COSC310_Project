const request = require('supertest');
const app = require('../server'); 
const db = require('../routes/db'); // Your database connection file
const { beforeAll, afterAll, describe, it, expect } = require('@jest/globals');

beforeAll(async () => {
    // Optionally, set up a test database or prepare mock data
});

afterAll(async () => {
    // Optionally, clean up or close the database connection
    await db.end(); 
});

describe('GET /api/student/:id', () => {
    it('should fetch the student profile successfully', async () => {
        // Assuming you have a valid student ID in your database, replace '1' with an actual ID
        const studentId = 1;

        const response = await request(app).get(`/api/student/${studentId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('gpa');
        expect(response.body).toHaveProperty('total_courses');
    });

    it('should return 404 if the student does not exist', async () => {
        const invalidStudentId = 999999; // An ID that does not exist in your database

        const response = await request(app).get(`/api/student/${invalidStudentId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Student not found');
    });

    it('should return 500 if there is a server error', async () => {
        // Mocking a database error
        jest.spyOn(db, 'query').mockImplementationOnce(() => Promise.reject(new Error('Database error')));

        const response = await request(app).get('/api/student/1');

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('error', 'Server error');

        // Restore original db.query
        db.query.mockRestore();
    });
});
