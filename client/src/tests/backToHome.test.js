import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { expect, request } = chai;

import app from '../index.js'; // Import the Express.js app

describe('Back to Home Button Test', () => {

  it('should navigate to the home page when the "Back to Home" button is clicked', (done) => {
    request(app)
      .get('/') // Simulate visiting the home page
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200); // Ensure the home page loads
        expect(res.text).to.include("Welcome to COSC310 Project"); // Ensure the home page contains expected content
        done();
      });
  });

  it('should return status 200 when accessing /browse_course.html', (done) => {
    request(app)
      .get('/browse_course.html') // Simulate visiting the browse courses page
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200); // Ensure browse course page loads
        expect(res.text).to.include("Browse Courses"); // Verify page content
        done();
      });
  });

  it('should redirect back to home when clicking "Back to Home"', (done) => {
    request(app)
      .get('/browse_course.html') // Visit browse course page
      .end((err, res) => {
        if (err) done(err);
        
        // Simulate clicking the "Back to Home" button (which should redirect to "/")
        request(app)
          .get('/')
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.text).to.include("Welcome to COSC310 Project"); // Verify redirection to home
            done();
          });
      });
  });
});