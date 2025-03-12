import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { expect, request } = chai;

import app from "../index.js"; // Your Express app entry file
import pool from "../routes/db.js"; // Import the MySQL connection

describe("Course API Routes", () => {
  before(async () => {
    // const connection = await pool.getConnection();
    // Optionally, insert test data into the database before tests
    // await pool.query("DELETE FROM courses"); // Clean up the courses table
  });

  after(async () => {
    // Clean up test data after tests
    await pool.query("DELETE FROM courses where course_code = 'CS101'"); // Clean up the courses table
  });

  it("should add a course when all fields are provided", (done) => {
    const course = {
      course_code: "CS101",
      course_name: "Intro to CS",
      department: "Computer Science",
      email: "admin@email.com",
      credits: 3,
      requires_lab: true,
    };

    request(app)
      .post("/admin/add-course")
      .send(course)
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done(err);
        }
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message").equal("Course created successfully");
        expect(res.body).to.have.property("courseId").that.is.a("number");
        done();
      });
  });

  it("should return 400 if required fields are missing", (done) => {
    const course = {
      course_code: "CS102",
      course_name: "Intro to CS",
      // department: "Computer Science",
      email: "admin@email.com",
      credits: 3,
      requires_lab: true,
    };
    
    request(app)
      .post("/admin/add-course")
      .send(course)
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").equal("All fields are required.");
        done();
      });
  });

  it("should return 400 if grade is missing", (done) => {

    request(app)
      .put("/admin/update-grade/1")
      .send({ email: "admin@email.com"})
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").equal("Grade is required.");
        done();
      });
  });

  it("should return all courses", (done) => {
    request(app)
      .get("/admin/courses")
      .send({ email: "admin@email.com"})
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done(err);
        }
        console.log('----------------------------');
        console.log(res.body);
        console.log('----------------------------');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
});