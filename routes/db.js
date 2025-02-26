// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const adminRoutes = require('./adminRoutes.js');  // Import  admin routes

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json()); 

// // Routes
// app.use('/admin', adminRoutes);  // Prefix all admin routes with /admin


// // Start the server
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

// Create a connection pool (better for performance)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "yourpassword",
  database: process.env.DB_NAME || "yourdatabase",
  connectionLimit: 10, // Limits number of simultaneous connections
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database.");
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = pool; // Export the database connection
