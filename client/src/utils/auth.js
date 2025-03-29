// client/src/utils/auth.js
export function getStudentIdFromToken(token) {
    if (!token) return null;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.id;
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  }