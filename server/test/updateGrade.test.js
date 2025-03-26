const assert = require('assert');
const request = require('supertest');
const express = require('express');
const courseEnrollmentRoutes = require('../routes/courses/enrollment');
const db = require('../db');
const sinon = require('sinon');

const app = express();
app.use(express.json());
app.use('/enrollments', courseEnrollmentRoutes);

describe('Enrollment API', function () {
  beforeEach(function() {
    // Setup database stub
    sinon.stub(db, 'query');
  });

  afterEach(function() {
    // Restore database stub
    db.query.restore();
  });

  it('GET /enrollments/student-enrollments/:student_id should return an array of enrollments for the student', async function () {
    const mockEnrollments = [
      { enrollment_id: 1, course_name: 'COSC101', course_code: 'COSC101', grade: 95 }
    ];
    db.query.resolves([mockEnrollments]);

    const response = await request(app).get('/enrollments/student-enrollments/1');
    
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, mockEnrollments);
  });

  it('PUT /enrollments/update-grade should update the grade of a specific enrollment', async function () {
    db.query.resolves([{ affectedRows: 1 }]);

    const response = await request(app)
      .put('/enrollments/update-grade')
      .send({ enrollment_id: 1, grade: 95 });

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, { message: 'Grade updated successfully' });
  });
});