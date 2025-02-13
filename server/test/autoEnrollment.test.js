// autoEnrollment.test.js
import pool from '../db.js'; // Importing the database connection to run queries directly
import autoEnroll from '../services/autoEnrollment.js'; // Importing the auto-enrollment service

describe('autoEnroll Function', () => {
  const section_id = 101; // The section ID for the test, which is the section the student will be auto-enrolled into

  // Before running all tests, simulate a student being on the waitlist for a section
  beforeAll(async () => {
    // Inserting a student (student_id = 1) into the waitlist for the specified section_id (101)
    await pool.query('INSERT INTO waitlist (student_id, section_id) VALUES (?, ?)', [1, section_id]);
  });

  // After all tests are done, clean up by removing the student from the waitlist and enrollments
  afterAll(async () => {
    // Deleting the student from the waitlist (removing test data)
    await pool.query('DELETE FROM waitlist WHERE student_id = ?', [1]);
    // Deleting the student from the enrollments table to ensure the test starts fresh each time
    await pool.query('DELETE FROM enrollments WHERE student_id = ?', [1]);
  });

  // Test case for auto-enrollment when a seat becomes available in the section
  it('should enroll the first student from the waitlist when a seat is available', async () => {
    // Call the autoEnroll function to attempt enrolling the student if a seat is available
    await autoEnroll(section_id);

    // Query the enrollments table to check if the student has been enrolled
    const [enrolled] = await pool.query('SELECT * FROM enrollments WHERE student_id = ? AND section_id = ?', [1, section_id]);
    
    // Assertion to verify that the student was successfully enrolled (at least one record should exist)
    expect(enrolled.length).toBe(1); // Ensure the student is now enrolled in the section

    // Query the waitlist to ensure the student has been removed from it after enrollment
    const [waitlist] = await pool.query('SELECT * FROM waitlist WHERE student_id = ?', [1]);
    
    // Assertion to verify the student is no longer on the waitlist
    expect(waitlist.length).toBe(0); // Ensure the student has been removed from the waitlist
  });
});
