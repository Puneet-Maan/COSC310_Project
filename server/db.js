const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',       // Your MySQL server's hostname
  user: 'root',            // Replace with your MySQL username
  password: 'root',        // Replace with your MySQL password
  database: 'studentPortal', // Replace with your database name
});

// Test the database connection
pool.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connection successful:', results);
  }
});

// Export the pool as a promise
module.exports = pool.promise();
