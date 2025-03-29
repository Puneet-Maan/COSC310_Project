const db = require('../db');

async function getStudentProfile(studentId) {
  const [rows] = await db.query(
    'SELECT name, age, major FROM students WHERE id = ?',
    [studentId]
  );
  return rows[0] || null;
}

async function updateStudentProfile(studentId, name, age, major) {
  const [result] = await db.query(
    'UPDATE students SET name = ?, age = ?, major = ? WHERE id = ?',
    [name, age, major, studentId]
  );

  if (result.affectedRows > 0) {
    return await getStudentProfile(studentId); // Return updated profile
  } else {
    return null;
  }
}

module.exports = {
  getStudentProfile,
  updateStudentProfile,
};