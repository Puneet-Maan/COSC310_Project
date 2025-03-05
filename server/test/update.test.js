import * as chai from 'chai';
import { default as chaiHttp, request } from "chai-http";
import app from '../index.js'; // Import the Express app
import pool from '../routes/db.js'; // Import MySQL connection

chai.use(chaiHttp);
const { expect } = chai;

describe('User API', () => {
  let userEmail = 'testuser1234@example.com';

  before(async () => {
    const connection = await pool.getConnection();
    try {
      // Create a test user directly in the database
      await connection.execute(
        'INSERT INTO accounts (name, email, phone, password) VALUES (?, ?, ?, ?)',
        ['Test User', userEmail, '1234567890', 'Password123']
      );
    } finally {
      connection.release();
    }
  });

  after(async () => {
    const connection = await pool.getConnection();
    try {
      // Clean up the test user
      await connection.execute('DELETE FROM accounts WHERE email = ?', [userEmail]);
    } finally {
      connection.release();
    }
    await pool.end(); // Ensure the pool is closed properly
  });

  // Test to retrieve user data
  it('should retrieve user data', (done) => {
    request.execute(app)
      .get('/api/user')
      .query({ email: userEmail })
      .end((err, res) => {
        expect(res).to.have.status(200); // Expect the status code to be 200 (OK)
        expect(res.body).to.have.property('name', 'Test User'); // Expect the response body to have the property 'name' with value 'Test User'
        expect(res.body).to.have.property('email', userEmail); // Expect the response body to have the property 'email' with value 'testuser@example.com'
        expect(res.body).to.have.property('phone', '1234567890'); // Expect the response body to have the property 'phone' with value '1234567890'
        done();
      });
  });

  // Test to update user data
  it('should update user data', (done) => {
    const newPhone = '0987654321';
    request.execute(app)
      .put('/api/user')
      .send({
        name: 'Test User Updated',
        email: userEmail,
        phone: newPhone,
        password: 'NewPassword123'
      })
      .end((err, res) => {
        expect(res).to.have.status(200); // Expect the status code to be 200 (OK)
        expect(res.body).to.have.property('success', true); // Expect the response body to have the property 'success' with value true

        // Verify the update
        request.execute(app)
          .get('/api/user')
          .query({ email: userEmail })
          .end((err, res) => {
            expect(res).to.have.status(200); // Expect the status code to be 200 (OK)
            expect(res.body).to.have.property('name', 'Test User Updated'); // Expect the response body to have the property 'name' with value 'Test User Updated'
            expect(res.body).to.have.property('phone', newPhone); // Expect the response body to have the property 'phone' with value '0987654321'
            done();
          });
      });
  });
});
