import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'nullPointersDatabase',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check connection on startup
pool.getConnection()
  .then(connection => {
    console.log("Connected to MySQL database!");
    connection.release();
  })
  .catch(err => {
    console.error(" Database connection failed:", err);
  });

export default pool;