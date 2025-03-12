import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { expect, request } = chai;

import app from "../index.js"; // Your Express app entry file

describe("Admin Verification", () => {
  it("should verify if the user is an admin", (done) => {
    const email = "admin@email.com";

    request(app)
      .post("/admin/check-admin")
      .send({ email })
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("isAdmin").that.is.a("boolean");
        done();
      });
  });

  it("should return 400 if email is missing", (done) => {
    request(app)
      .post("/admin/check-admin")
      .send({})
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").equal("Email is required.");
        done();
      });
  });

  it("should return 404 if user is not found", (done) => {
    const email = "nonexistent@email.com";

    request(app)
      .post("/admin/check-admin")
      .send({ email })
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done(err);
        }
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message").equal("User not found.");
        done();
      });
  });
});

