import * as chai from "chai";
import { default as chaiHttp, request } from "chai-http";
chai.use(chaiHttp);
var expect = chai.expect;

import app from "../index.js"; // Your Express app entry file
import pool from "../routes/db.js"; // Import the MySQL connection

describe("Course API Routes", () => {
  before(async () => {
    // Optionally, insert test data into the database before tests
    await pool.query("DELETE FROM courses"); // Clean up the courses table
  });

  after(async () => {
    // Clean up test data after tests
    await pool.query("DELETE FROM courses"); // Clean up the courses table
  });

  it("should add a course when all fields are provided", (done) => {
    const course = {
      course_code: "CS101",
      course_name: "Intro to CS",
      department: "Computer Science",
      credits: 3,
      requires_lab: true,
    };

    request.execute(app)
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
    request.execute(app)
      .post("/admin/add-course")
      .send({ course_code: "CS101" })
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
    request.execute(app)
      .put("/admin/update-grade/1")
      .send({})
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
    request.execute(app)
      .get("/admin/courses")
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
});