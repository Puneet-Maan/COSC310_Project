const { convertTo24Hour, getNextDayOfWeek } = require('../courses/utils');

describe('Utils Functions', () => {
  describe('convertTo24Hour', () => {
    test('should convert 12-hour AM time to 24-hour time', () => {
      expect(convertTo24Hour('10:30 AM')).toBe('10:30:00');
    });

    test('should convert 12-hour PM time to 24-hour time', () => {
      expect(convertTo24Hour('02:45 PM')).toBe('14:45:00');
    });

    test('should handle 12:00 AM', () => {
      expect(convertTo24Hour('12:00 AM')).toBe('00:00:00');
    });

    test('should handle 12:00 PM', () => {
      expect(convertTo24Hour('12:00 PM')).toBe('12:00:00');
    });

    test('should handle single digit hours', () => {
      expect(convertTo24Hour('1:15 PM')).toBe('13:15:00');
      expect(convertTo24Hour('9:00 AM')).toBe('09:00:00');
    });
  });

  describe('getNextDayOfWeek', () => {
    const originalDate = Date;

    beforeEach(() => {
      // Mock Date to control the current date
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            // Set the current date to a known date (e.g., a Monday)
            super(Date.UTC(2023, 10, 20, 12)); // November 20, 2023, Monday
          } else {
            super(...args);
          }
        }
      };
    });

    afterEach(() => {
      // Restore the original Date object
      global.Date = originalDate;
    });

    test('should get the next Monday', () => {
      expect(getNextDayOfWeek('Mon')).toBe('2023-11-27');
    });

    test('should get the next Tuesday', () => {
      expect(getNextDayOfWeek('Tue')).toBe('2023-11-21');
    });

    test('should get the next Wednesday', () => {
      expect(getNextDayOfWeek('Wed')).toBe('2023-11-22');
    });

    test('should get the next Thursday', () => {
      expect(getNextDayOfWeek('Thu')).toBe('2023-11-23');
    });

    test('should get the next Friday', () => {
      expect(getNextDayOfWeek('Fri')).toBe('2023-11-24');
    });

    test('should get the next Saturday', () => {
      expect(getNextDayOfWeek('Sat')).toBe('2023-11-25');
    });

    test('should get the next Sunday', () => {
      expect(getNextDayOfWeek('Sun')).toBe('2023-11-26');
    });
  });
});