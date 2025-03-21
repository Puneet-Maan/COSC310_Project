// calendar.js (Backend - Express)
const express = require('express');
const router = express.Router();
const db = require('../db'); // Make sure this is your database connection

// Get calendar events for a student
router.get('/:student_id', async (req, res) => {
  const { student_id } = req.params;

  try {
    const [events] = await db.query(
      'SELECT c.name AS course_name, e.event_date, e.start_time, e.end_time ' +
      'FROM calendar_events e JOIN courses c ON e.course_id = c.id ' +
      'WHERE e.student_id = ?',
      [student_id]
    );

    // Check if no events are found
    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found for this student.' });
    }

    // Format events to return in a simpler way (using just date, start time, and end time)
    const formattedEvents = events.map((event) => ({
      course_name: event.course_name,
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
    }));

    res.json(formattedEvents);
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
