const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',       // Your MySQL server's hostname
  user: 'root',            // Replace with your MySQL username
  password: 'root',        // Replace with your MySQL password
  database: 'nullPointersDatabase', // Replace with your database name
});

const db = pool.promise();
db.end = () => pool.end(); // Explicitly add a method to close the pool

module.exports = db;
