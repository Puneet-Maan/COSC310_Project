const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = 5000;

// Middleware
app.use(express.json()); // Allows JSON parsing
app.use(cors()); // Allows frontend to talk to backend

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",  
  user: "root",        
  password: "your_password", // Set your MySQL password
  database: "your_database",  // Set your database name
});

// Connecting to MySQL
db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  } else {
    console.log("Connected to MySQL database.");
  }
});

// Routes
app.use("/admin", adminRoutes); // All admin routes will start with /admin

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
