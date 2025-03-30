import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css'; // Basic CSS

function Calendar() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [conflicts, setConflicts] = useState([]);

  // Fetch events for the student
  useEffect(() => {
    const fetchEvents = async (studentId) => {
      try {
        const response = await fetch(`http://localhost:5000/calendar/${studentId}`);
        const data = await response.json();
        if (data.message) {
          setMessage(data.message);
        } else {
          setEvents(data);
          detectConflicts(data);
        }
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        setMessage('Failed to fetch calendar events. Please try again.');
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const studentId = decodedToken.id;

    fetchEvents(studentId);
  }, []);

  // Detect conflicts between events
  const detectConflicts = (events) => {
    const conflicts = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        if (isConflict(events[i], events[j])) {
          conflicts.push({ event1: events[i], event2: events[j] });
        }
      }
    }
    setConflicts(conflicts);
  };

  // Check if two events conflict
  const isConflict = (event1, event2) => {
    const [start1, end1] = parseTimeRange(event1.start_time, event1.end_time, event1.event_date);
    const [start2, end2] = parseTimeRange(event2.start_time, event2.end_time, event2.event_date);

    return (
      event1.event_date === event2.event_date && // Same day
      ((start1 >= start2 && start1 < end2) || // Overlapping start
        (start2 >= start1 && start2 < end1)) // Overlapping end
    );
  };

  // Parse time range into start and end times
  const parseTimeRange = (startTime, endTime, eventDate) => {
    const parseTime = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date(eventDate);
      date.setHours(hours, minutes, 0);
      return date.getTime();
    };
    return [parseTime(startTime), parseTime(endTime)];
  };

  // Get events for a specific day
  const getDayEvents = (day) => {
    return events.filter((event) => {
      const eventDate = new Date(event.event_date);
      return eventDate.getUTCDay() === day; // Match the day
    });
  };

  // Render events for a specific time slot
  const renderEventsForSlot = (hour, minute, day) => {
    const dayEvents = getDayEvents(day + 1);
    return dayEvents.map((event, index) => {
      const eventStart = parseTimeRange(event.start_time, event.end_time, event.event_date)[0];
      const eventEnd = parseTimeRange(event.start_time, event.end_time, event.event_date)[1];

      const currentSlot = new Date();
      currentSlot.setHours(hour, minute, 0);
      const currentSlotTime = currentSlot.getTime();

      if (currentSlotTime >= eventStart && currentSlotTime < eventEnd) {
        const isConflicting = conflicts.some(
          (conflict) =>
            conflict.event1.id === event.id || conflict.event2.id === event.id
        );

        return (
          <div
            key={index}
            className={`event ${isConflicting ? 'conflict' : ''}`}
            style={{ backgroundColor: getCourseColor(event.course_name) }}
          >
            <strong>{event.course_name}</strong>
            <br />
            {event.start_time} - {event.end_time}
          </div>
        );
      }
      return null;
    });
  };

  // Generate random colors for courses
  const courseColors = {};
  const getCourseColor = (courseName) => {
    if (!courseColors[courseName]) {
      courseColors[courseName] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
    return courseColors[courseName];
  };

  // Render time slots for the calendar
  const renderTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        timeSlots.push({ hour, minute });
      }
    }
    return timeSlots;
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Student Calendar</h1>
      {message && <div className="error-message">{message}</div>}

      {/* Calendar Table */}
      <div className="calendar-table-container">
        <table className="calendar-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <tbody>
            {renderTimeSlots().map((slot, index) => {
              const { hour, minute } = slot;
              return (
                <tr key={`${hour}-${minute}`}>
                  <td className="time-slot">{`${hour}:${minute === 0 ? '00' : minute}`}</td>
                  {Array.from({ length: 5 }, (_, day) => (
                    <td key={day} className="calendar-cell">
                      {renderEventsForSlot(hour, minute, day)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Conflicts Section */}
      {conflicts.length > 0 && (
        <div className="conflicts-container">
          <h2>Conflicting Events</h2>
          <ul>
            {conflicts.map((conflict, index) => (
              <li key={index}>
                <strong>{conflict.event1.course_name}</strong> and{' '}
                <strong>{conflict.event2.course_name}</strong> on{' '}
                {conflict.event1.event_date} at {conflict.event1.start_time} -{' '}
                {conflict.event2.start_time}.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Calendar;