// Helper function to convert 12-hour time to 24-hour time
function convertTo24Hour(time) {
    const [hour, minutePart] = time.split(':');
    const [minute, period] = minutePart.split(' ');
    let hour24 = parseInt(hour, 10);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    return `${String(hour24).padStart(2, '0')}:${minute}:00`;
  }
  
  // Helper function to get the next date for a given day of the week
  function getNextDayOfWeek(dayOfWeek) {
    const daysOfWeek = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const now = new Date();
    const resultDate = new Date();
    const diff = (daysOfWeek[dayOfWeek] + 7 - now.getUTCDay()) % 7;
    resultDate.setUTCDate(now.getUTCDate() + (diff || 7)); // If the same day, get the next week's date
    return resultDate.toISOString().split('T')[0];
  }
  
  module.exports = { convertTo24Hour, getNextDayOfWeek };
  