import * as chai from "chai";
import { default as chaiHttp, request } from "chai-http";
chai.use(chaiHttp);
const expect = chai.expect;

import app from '../index.js'; // Your Express app entry file
import pool from '../routes/db.js'; // Import the MySQL connection

describe('Admin Routes', () => {
  beforeEach(() => {
    // Reset mocks or setup necessary test data
  });

  /**
   * Test for Creating a Course
   */
  describe('POST /admin/create-course', () => {
    it('should create a course successfully', (done) => {
      request.execute(app)
        .post('/admin/create-course')
        .send({
          name: 'Introduction to Programming',
          description: 'Learn programming basics',
          instructor: 'Dr. John Doe',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message', 'Course created successfully');
          expect(res.body).to.have.property('courseId');
          done();
        });
    });

    it('should return 400 if any field is missing', (done) => {
      request.execute(app)
        .post('/admin/create-course')
        .send({
          name: 'Incomplete Course',
          description: 'This is missing an instructor',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'All fields are required');
          done();
        });
    });
  });

  /**
   * Test for Updating a User Grade
   */
  describe('PUT /admin/update-grade', () => {
    it('should update user grade successfully', (done) => {
      request.execute(app)
        .put('/admin/update-grade')
        .send({
          userId: 10,
          grade: 'A',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Grade updated successfully');
          done();
        });
    });

    it('should return 400 if userId or grade is missing', (done) => {
      request.execute(app)
        .put('/admin/update-grade')
        .send({ userId: 10 }) // Missing grade
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'User ID and grade are required');
          done();
        });
    });
  });
});
