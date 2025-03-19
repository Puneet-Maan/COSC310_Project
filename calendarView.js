import React, { useState } from 'react';

function CalendarView() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM',
  ];

  const [courses, setCourses] = useState([
    { id: 1, name: 'Math 101', code: 'MATH 101', description: 'Introduction to mathematical concepts and problem-solving strategies. Topics include algebra, geometry, and basic calculus.', enrolled: 3, capacity: 3, days: ['Monday', 'Wednesday'], time: '9:00 AM', duration: 3, color: 'bg-blue-200' },
    { id: 2, name: 'Physics 111', code: 'PHYS 111', description: 'A study of fundamental physical principles including mechanics, waves, and thermodynamics.', enrolled: 2, capacity: 3, days: ['Tuesday', 'Thursday'], time: '11:00 AM', duration: 3, color: 'bg-green-200' },
    { id: 3, name: 'Math 200', code: 'MATH 200', description: 'A deeper dive into calculus and linear algebra, designed for students pursuing math or science majors.', enrolled: 1, capacity: 3, days: ['Monday', 'Wednesday', 'Friday'], time: '1:00 PM', duration: 2, color: 'bg-yellow-200' },
    { id: 4, name: 'Chem 121', code: 'CHEM 121', description: 'Introduction to the principles of chemistry, including atomic structure, chemical bonding, and thermochemistry.', enrolled: 1, capacity: 3, days: ['Tuesday', 'Thursday'], time: '3:00 PM', duration: 2, color: 'bg-red-200' },
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);

  // Helper function to check if a course matches a day and time slot
  const getCourseForSlot = (day, time) => {
    return courses.find(course => {
      const courseStartIndex = timeSlots.indexOf(course.time);
      const slotIndex = timeSlots.indexOf(time);
      return course.days.includes(day) && slotIndex >= courseStartIndex && slotIndex < courseStartIndex + course.duration;
    });
  };

  // Handle dropping a course
  const handleDropCourse = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
    setSelectedCourse(null); // Close the modal after dropping the course
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">Calendar View</h1>
      <div className="grid grid-cols-8 border border-gray-300">
        {/* Render the header row with days */}
        <div className="border border-gray-300 p-2 font-bold text-center bg-gray-200">Time</div>
        {days.map((day) => (
          <div key={day} className="border border-gray-300 p-2 font-bold text-center bg-gray-200">
            {day}
          </div>
        ))}

        {/* Render time slots and course blocks */}
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            {/* Time column */}
            <div className="border border-gray-300 p-2 text-center bg-gray-100 font-bold">
              {time}
            </div>
            {/* Day columns */}
            {days.map((day) => {
              const course = getCourseForSlot(day, time);
              return (
                <div
                  key={`${day}-${time}`}
                  className={`border border-gray-300 p-2 text-center cursor-pointer ${
                    course ? course.color : 'bg-white'
                  }`}
                  onClick={() => course && setSelectedCourse(course)}
                >
                  {course ? course.name : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Course details modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold">{selectedCourse.code} - {selectedCourse.name}</h2>
            <p className="mt-2">{selectedCourse.description}</p>
            <p className="mt-2">Enrolled: {selectedCourse.enrolled}/{selectedCourse.capacity}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleDropCourse(selectedCourse.id)}
            >
              Drop Course
            </button>
            <button
              className="mt-2 ml-4 bg-gray-300 text-black px-4 py-2 rounded"
              onClick={() => setSelectedCourse(null)} // Close the modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
