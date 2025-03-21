const express = require('express');
const router = express.Router();
const db = require('../../db'); // Adjust the path to your database connection file
const { convertTo24Hour, getNextDayOfWeek } = require('./utils');

// Enroll in a course or add to the waitlist if full
router.post('/enroll', async (req, res) => {
  const { student_id, course_id } = req.body;

  try {
    const [course] = await db.query('SELECT capacity, enrolled, schedule FROM courses WHERE id = ?', [course_id]);
    if (!course.length) {
      return res.status(400).json({ message: 'Course does not exist' });
    }

    // Check if the course is full
    if (course[0].enrolled >= course[0].capacity) {
      // Add the student to the waitlist
      const [lastPosition] = await db.query(
        'SELECT MAX(position) as maxPosition FROM waitlist WHERE course_id = ?',
        [course_id]
      );
      const newPosition = (lastPosition[0]?.maxPosition || 0) + 1;

      await db.query(
        'INSERT INTO waitlist (student_id, course_id, position) VALUES (?, ?, ?)',
        [student_id, course_id, newPosition]
      );
      return res.status(200).json({ message: 'You have been added to the waitlist.', waitlisted: true });
    }

    // Check if the student is already enrolled
    const [enrollment] = await db.query(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [student_id, course_id]
    );
    if (enrollment.length) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Enroll the student
    await db.query('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [student_id, course_id]);
    await db.query('UPDATE courses SET enrolled = enrolled + 1 WHERE id = ?', [course_id]);

    // Parse the course schedule and insert calendar events
    const scheduleParts = course[0].schedule.split(' ');
    const days = scheduleParts[0].split('/');
    const timeRange = scheduleParts.slice(1).join(' ').split(' - ');
    const startTime = convertTo24Hour(timeRange[0].trim());
    const endTime = convertTo24Hour(timeRange[1].trim());

    for (const day of days) {
      const eventDate = getNextDayOfWeek(day);
      await db.query(
        'INSERT INTO calendar_events (student_id, course_id, event_date, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
        [student_id, course_id, eventDate, startTime, endTime]
      );
    }

    res.json({ message: 'Enrollment successful', waitlisted: false });
  } catch (err) {
    console.error('Error enrolling in course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Drop a course and notify the next student in the waitlist if applicable
router.post('/drop', async (req, res) => {
  const { student_id, course_id } = req.body;

  try {
    // Remove the enrollment record
    await db.query('DELETE FROM enrollments WHERE student_id = ? AND course_id = ?', [student_id, course_id]);
    await db.query('UPDATE courses SET enrolled = enrolled - 1 WHERE id = ?', [course_id]);

    // Remove associated calendar events
    await db.query('DELETE FROM calendar_events WHERE student_id = ? AND course_id = ?', [student_id, course_id]);

    // Notify the next student in the waitlist
    const [nextInLine] = await db.query(
      'SELECT w.student_id, c.name, c.schedule FROM waitlist w JOIN courses c ON w.course_id = c.id WHERE w.course_id = ? ORDER BY w.position ASC LIMIT 1',
      [course_id]
    );

    // If there is a student in the waitlist, send them a notification
    if (nextInLine.length) {
      await db.query('DELETE FROM waitlist WHERE student_id = ? AND course_id = ?', [
        nextInLine[0].student_id,
        course_id,
      ]);

      // Create notification for the next student in the waitlist
      const message = `A seat is now available in the course "${nextInLine[0].name}" scheduled at ${nextInLine[0].schedule}. Please enroll if you wish to take this course.`;
      await db.query('INSERT INTO notifications (student_id, message) VALUES (?, ?)', [
        nextInLine[0].student_id,
        message,
      ]);

      console.log(`Notification sent to student ${nextInLine[0].student_id} about available seat in course ${course_id}.`);
    }

    res.json({ message: 'Course dropped successfully.' });
  } catch (err) {
    console.error('Error dropping course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
