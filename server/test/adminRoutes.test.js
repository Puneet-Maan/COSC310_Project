import * as chai from "chai";
import {default as chaiHttp, request} from "chai-http";
chai.use(chaiHttp);
var expect = chai.expect;


import app from '../index.js'; // Your Express app entry file

describe('Admin Routes', () => {
  beforeEach(() => {
    // Reset mocks or setup necessary test data
  });

  /**
   * Test for Creating a Course
   */
  describe('POST /admin/add-course', () => {
    it('should create a course successfully', (done) => {
      request.execute(app)
        .post('/admin/add-course')
        .send({
          course_code: 'CS101',
          course_name: 'Introduction to Programming',
          department: 'Computer Science',
          credits: 3,
          requires_lab: false,
          instructor: 'Dr. John Doe',
        })
        .end((err, res) => {
          if (err) {
            console.error("Error creating course:", err);
          }
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message', 'Course created successfully');
          expect(res.body).to.have.property('courseId');
          done();
        });
    });

    it('should return 400 if any field is missing', (done) => {
      request.execute(app)
        .post('/admin/add-course')
        .send({
          course_code: 'CS101',
          course_name: 'Incomplete Course',
          department: 'Computer Science',
          credits: 3,
          requires_lab: false,
          // Missing instructor
        })
        .end((err, res) => {
          if (err) {
            console.error("Error creating course:", err);
          }
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'All fields are required.');
          done();
        });
    });
  });

  /**
   * Test for Updating a User Grade
   */
  describe('PUT /admin/update-grade/:userId', () => {
    it('should update user grade successfully', (done) => {
      request.execute(app)
        .put('/admin/update-grade/10')
        .send({
          grade: 'A',
        })
        .end((err, res) => {
          if (err) {
            console.error("Error updating grade:", err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Grade updated successfully');
          done();
        });
    });

    it('should return 400 if grade is missing', (done) => {
      request.execute(app)
        .put('/admin/update-grade/10')
        .send({}) // Missing grade
        .end((err, res) => {
          if (err) {
            console.error("Error updating grade:", err);
          }
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'Grade is required.');
          done();
        });
    });
  });

  /**
   * Test for Getting All Courses
   */
  describe('GET /admin/courses', () => {
    it('should get all courses successfully', (done) => {
      request.execute(app)
        .get('/admin/courses')
        .end((err, res) => {
          if (err) {
            console.error("Error fetching courses:", err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
});
