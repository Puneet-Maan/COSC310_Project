const request = require('supertest');
const express = require('express');
const enrollmentRoutes = require('../routes/courses/enrollment');
const assert = require('assert');
const db = require('../db'); 
const sinon = require('sinon');

describe('Enrollment API', function () {
  let app;
  beforeEach(function () {
    app = express();
    app.use(express.json());
    app.use('/enrollments', enrollmentRoutes);

    // Stub database queries
    sinon.stub(db, 'query');
  });

  afterEach(function () {
    // Restore database stub
    db.query.restore();
  });

  it('POST /enrollments/enroll should enroll a student successfully when the course is not full', async function () {
    const mockCourse = [{ capacity: 30, enrolled: 20, schedule: 'Mon/Wed 10:00 AM - 12:00 PM' }];
    const mockEnrollment = [];
  
    // Mock database responses
    db.query.onCall(0).resolves(mockCourse); // Course exists and is not full
    db.query.onCall(1).resolves(mockEnrollment); // No existing enrollment for the student
    db.query.onCall(2).resolves({ affectedRows: 1 }); // Enroll the student
    db.query.onCall(3).resolves({ affectedRows: 1 }); // Update the course's enrolled count
    db.query.onCall(4).resolves({ affectedRows: 1 }); // Insert calendar events
  
    const response = await request(app)
      .post('/enrollments/enroll')
      .send({ student_id: 1, course_id: 101 });
  
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, { message: 'Enrollment successful', waitlisted: false });
  });
});