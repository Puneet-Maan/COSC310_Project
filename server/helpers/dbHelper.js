const db = require('../db'); // Adjust the path to your database connection file

async function executeQuery(query, params = []) {
  try {
    const [result] = await db.query(query, params);
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw new Error('Database query failed');
  }
}

module.exports = { executeQuery };