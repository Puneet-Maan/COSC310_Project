import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Database host
  user: process.env.DB_USER || 'root', // Database user
  password: process.env.DB_PASSWORD || 'root', // Database password
  database: process.env.DB_NAME || 'nullPointersDatabase', // Database name
  port: process.env.DB_PORT || 3306, // Database port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


export default pool; // Export the connection pool