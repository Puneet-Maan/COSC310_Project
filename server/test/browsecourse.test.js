import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { expect, request } = chai;

import app from '../index.js'; // import index.js (express server)
import pool from '../routes/db.js'; // Import the MySQL db connection, to allow modifying during testing

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
    it('should fetch all courses', (done) => { //test to fetch all courses
      request(app)
        .get('/api/courses')  //send a GET request to the /api/courses endpoint
        .end((err, res) => { //function to handle response
          if (err) done(err); //if err occurs, end test
          console.log('----------------------------');
          console.log(res.body); 
          console.log('----------------------------');
          expect(res).to.have.status(200); // status should be 200 OK
          expect(res.body).to.be.an('array'); //response should be an array of courses
          done();
        });
    });

    //to verify if api retrives correct details for a specific course
    it('should fetch course details by course code', (done) => {
      const courseCode = 'CS101'; 
      request(app)
        .get(`/api/courses/${courseCode}`) //GET request to api/courses/CS101
        .end((err, res) => { 
          if (err) done(err);
          console.log('----------------------------');
          console.log(res.body);
          console.log('----------------------------');
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object'); //response should be an object
          expect(res.body.course_code).to.equal(courseCode); //course code should match
          done();
        });
    });

    
    it('should return 404 for non-existent course code', (done) => {
      const invalidCourseCode = 'INVALID_CODE';  //fake course code
      request(app)
        .get(`/api/courses/${invalidCourseCode}`)
        .end((err, res) => {
          if (err) done(err);
          console.log('----------------------------');
          console.log(res.body);
          console.log('----------------------------');
          expect(res).to.have.status(404); //returns 404 not found
          expect(res.body).to.be.an('object'); //response should be an error object
          expect(res.body.message).to.equal('Course not found'); 
          done();
        });
    });
  });
});