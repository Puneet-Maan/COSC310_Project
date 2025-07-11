import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';
import { CSVLink } from 'react-csv';

function Calendar() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async (studentId) => {
      try {
        const response = await fetch(`http://localhost:3000/calendar/${studentId}`);
        const data = await response.json();
        if (data.message) {
          setMessage(data.message);
        } else {
          setEvents(data);
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

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const courseColors = {};

  const getCourseColor = (courseName) => {
    if (!courseColors[courseName]) {
      courseColors[courseName] = getRandomColor();
    }
    return courseColors[courseName];
  };

  const getDayEvents = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate.getUTCDay() === day;
    });
  };

  const parseTime = (time, eventDate) => {
    if (time) {
      const [hours, minutes] = time.split(':');
      const eventDateTime = new Date(eventDate);
      eventDateTime.setHours(parseInt(hours, 10));
      eventDateTime.setMinutes(parseInt(minutes, 10));
      eventDateTime.setSeconds(0);
      return eventDateTime;
    } else {
      console.warn('Time is missing or undefined.');
    }
    return new Date();
  };

  const formatEventTime = (eventTime) => {
    return eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatTimeLabel = (hour, minute) => {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const renderEventsForSlot = (hour, minute, day) => {
    const dayEvents = getDayEvents(day + 1);
    return dayEvents.map((event, index) => {
      const eventStart = parseTime(event.start_time, event.event_date);
      const eventEnd = parseTime(event.end_time, event.event_date);

      const eventStartSlot = eventStart.getHours() * 2 + Math.floor(eventStart.getMinutes() / 30);
      const currentSlot = hour * 2 + Math.floor(minute / 30);
      const eventEndSlot = eventEnd.getHours() * 2 + Math.floor(eventEnd.getMinutes() / 30);

      if (currentSlot >= eventStartSlot && currentSlot < eventEndSlot) {
        return (
          <div key={index} className="event" style={{ height: '100%', backgroundColor: getCourseColor(event.course_name) }}>
            {currentSlot === eventStartSlot && (
              <>
                <strong>{event.course_name}</strong>
                <br />
                {formatEventTime(eventStart)} - {formatEventTime(eventEnd)}
              </>
            )}
          </div>
        );
      }
      return null;
    });
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        timeSlots.push({ hour, minute });
      }
    }
    return timeSlots;
  };

  const prepareCSVData = () => {
    const csvData = [['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']];
    renderTimeSlots().forEach((slot) => {
      const { hour, minute } = slot;
      const timeLabel = formatTimeLabel(hour, minute);
      const row = [timeLabel];
      Array.from({ length: 5 }, (_, day) => {
        const dayEvents = getDayEvents(day + 1);
        const cellEvents = dayEvents.filter((event) => {
          const eventStart = parseTime(event.start_time, event.event_date);
          const eventEnd = parseTime(event.end_time, event.event_date);
          const eventStartSlot = eventStart.getHours() * 2 + Math.floor(eventStart.getMinutes() / 30);
          const currentSlot = hour * 2 + Math.floor(minute / 30);
          const eventEndSlot = eventEnd.getHours() * 2 + Math.floor(eventEnd.getMinutes() / 30);
          return currentSlot >= eventStartSlot && currentSlot < eventEndSlot;
        });
        row.push(cellEvents.map((event) => `${event.course_name} (${formatEventTime(parseTime(event.start_time, event.event_date))} - ${formatEventTime(parseTime(event.end_time, event.event_date))})`).join('\n'));
      });
      csvData.push(row);
    });
    return csvData;
  };

  const csvData = prepareCSVData();
  const csvFileName = 'calendar.csv';

  return (
    <div className="admin-course-list-page">
      <h1 className="page-title">Student Calendar</h1>
      {message && <div className="error-message">{message}</div>}

      {events.length > 0 && (
  <div style={{ textAlign: 'center', marginBottom: '1px' }}>
    <button
      className="btn-primary"
      onClick={() => {
        const csv = prepareCSVData().map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calendar.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }}
      style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
    >
      Export Calendar
    </button>
  </div>
)}

      <div className="table-container">
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
                  <td className="time-slot">{formatTimeLabel(hour, minute)}</td>
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
    </div>
  );
}

export default Calendar;