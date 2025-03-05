import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { expect, request } = chai;

import app from '../index.js'; // Your Express app entry file
import pool from '../routes/db.js'; // Import the MySQL connection

describe('Auth API', () => {
  before(async () => {
    // Optionally, insert test users into the database before tests
    // await pool.query('INSERT INTO accounts (email, password, name) VALUES (?, ?, ?)', 
    //   ['test1@example.com', 'password123', 'Test User']);
  });

  after(async () => {
    // Clean up test users after tests
    // await pool.query('DELETE FROM accounts WHERE email = ?', ['test1@example.com']);
  });

  it('should login successfully with valid credentials', (done) => {
    request(app)
      .post('/api/login')
      .send({ email: 'test.student@example.com', password: 'testpassword123' })
      .end((err, res) => {
        if (err) done(err);
        console.log('----------------------------');
        console.log(res.body);
        console.log(res.body.userName);
        console.log('----------------------------');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.be.true;
        expect(res.body.userName).to.equal('Test Student');
        done();
      });
  });

  describe('Browse Courses API', () => {
    it('should fetch all courses', (done) => {
      request(app)
        .get('/api/courses')
        .end((err, res) => {
          if (err) done(err);
          console.log('----------------------------');
          console.log(res.body);
          console.log('----------------------------');
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should fetch course details by course code', (done) => {
      const courseCode = 'CS101'; // Replace with a valid course code from your database
      request(app)
        .get(`/api/courses/${courseCode}`)
        .end((err, res) => {
          if (err) done(err);
          console.log('----------------------------');
          console.log(res.body);
          console.log('----------------------------');
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.course_code).to.equal(courseCode);
          done();
        });
    });

    it('should return 404 for non-existent course code', (done) => {
      const invalidCourseCode = 'INVALID_CODE';
      request(app)
        .get(`/api/courses/${invalidCourseCode}`)
        .end((err, res) => {
          if (err) done(err);
          console.log('----------------------------');
          console.log(res.body);
          console.log('----------------------------');
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Course not found');
          done();
        });
    });
  });
});