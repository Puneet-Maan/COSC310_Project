// sections.test.js
import request from 'supertest'; // Importing supertest for sending HTTP requests to the server
import app from '../server'; // Importing the Express app to run API tests
import pool from '../db.js'; // Importing the DB connection to verify DB changes after API calls

describe('Section API', () => {
  const section_id = 101; // The section ID for the test
  const new_capacity = 2; // New capacity for the section to simulate increasing the number of seats

  // Before all tests, simulate a student being on the waitlist for the section
  beforeAll(async () => {
    // Inserting a student into the waitlist for the specified section_id (101)
    await pool.query('INSERT INTO waitlist (student_id, section_id) VALUES (?, ?)', [1, section_id]);
  });

  // After all tests, clean up by removing the student from the waitlist and enrollments
  afterAll(async () => {
    // Deleting the student from the waitlist
    await pool.query('DELETE FROM waitlist WHERE student_id = ?', [1]);
    // Deleting the student from the enrollments table
    await pool.query('DELETE FROM enrollments WHERE student_id = ?', [1]);
  });

  // Test case to update section capacity and trigger auto-enrollment
  it('should update the section capacity and trigger auto-enrollment', async () => {
    // Making a PUT request to update the section's capacity
    const response = await request(app)
      .put(`/sections/${section_id}/capacity`) // The endpoint to update section capacity
      .send({ new_capacity }); // Sending the new capacity as part of the request body

    // Assertion to check if the response status is OK (200)
    expect(response.status).toBe(200); // 200 means OK, indicating successful API call
    expect(response.body.message).toBe('Section capacity updated and auto-enrollment checked'); // Check the success message

    // Query the database to verify the section capacity has been updated
    const [section] = await pool.query('SELECT capacity FROM sections WHERE section_id = ?', [section_id]);
    
    // Assertion to verify the new capacity has been set in the database
    expect(section[0].capacity).toBe(new_capacity); // Ensure the capacity has been updated
  });
});
