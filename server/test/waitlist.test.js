// waitlist.test.js
import request from 'supertest'; // Importing supertest for making HTTP requests to the server
import app from '../index.js'; // Importing the Express app from the main index.js file

describe('Waitlist API', () => {

  // Test case for adding a student to the waitlist
  it('should add a student to the waitlist', async () => {
    // Prepare the new student data to send in the POST request
    const newStudent = {
      student_id: 1,    // Unique identifier for the student
      section_id: 101,  // The section/course ID for which the student is joining the waitlist
    };

    // Make a POST request to the '/waitlist' endpoint with the student data
    const response = await request(app).post('/waitlist').send(newStudent);

    // Assertions to verify the response
    expect(response.status).toBe(201); // 201 means Created, confirming the resource was successfully created
    expect(response.body.message).toBe('Student added to waitlist'); // Ensure the response message confirms the student was added
    expect(response.body.waitlist_id).toBeDefined(); // Verify that a 'waitlist_id' was returned in the response body
  });

  // Test case for fetching all waitlist entries
  it('should fetch all waitlist entries', async () => {
    // Make a GET request to the '/waitlist' endpoint to retrieve all waitlist entries
    const response = await request(app).get('/waitlist');

    // Assertions to verify the response
    expect(response.status).toBe(200); // 200 means OK, confirming the request was successful
    expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array, indicating a list of waitlist entries
    expect(response.body.length).toBeGreaterThan(0); // Ensure that there is at least one entry in the waitlist (i.e., the waitlist is not empty)
  });

});
