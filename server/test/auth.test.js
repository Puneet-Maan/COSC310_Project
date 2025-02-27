import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js'; // Import the Express app

describe('Auth API', () => {
  it('should login successfully with valid credentials', (done) => {
    request(app)
      .post('/api/login')
      .send({ email: 'john@example.com', password: 'password123' }) // Use correct credentials from your data
      .end((err, res) => {
        console.log('----------------------------');
        console.log(res.body);
        console.log(res.body.userName);
        console.log('----------------------------');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.be.true;
        expect(res.body.userName).to.equal('John Doe'); // Update according to your data
        done();
      });
  });
});
