import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { expect, request } = chai;

import app from '../index.js'; // Your Express app entry file
import pool from '../routes/db.js'; // Import the MySQL connection

describe('Register API', () => {
  after(async () => {
    // Clean up test users after tests
    await pool.query('DELETE FROM accounts WHERE email = ?', ['test.register@example.com']);
  });

  it('should register a new user successfully', (done) => {
    request(app)
      .post('/api/register')
      .send({
        email: 'test.register@example.com',
        password: 'Password123',
        name: 'Test Register',
        phone: '1234567890'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it('should fail to register a user with an invalid email', (done) => {
    request(app)
      .post('/api/register')
      .send({
        email: 'invalid-email',
        password: 'Password123',
        name: 'Test Register',
        phone: '1234567890'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.errors).to.be.an('array');
        done();
      });
  });

  it('should fail to register a user with a weak password', (done) => {
    request(app)
      .post('/api/register')
      .send({
        email: 'test.register@example.com',
        password: 'weakpass',
        name: 'Test Register',
        phone: '1234567890'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.errors).to.be.an('array');
        done();
      });
  });
});
