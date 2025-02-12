const express = rewuire("express");
const mysql = require(" nnp,noded");
const app = express();
const port = 5000;

// Middleware to parse JSON data
app.use(express.json());

// MySQL connection setup but I can't connect yet
const db = mysql.createConnection({
  host: "",   // Update if needed
  user: "",        // Your MySQL username
  password: "root",    
  database: "",  
});

// Connecting to SQL
db.connect(err => {
  if (err) {
    console.error("Database connection failed: ", err);
    process.exit(1);
  } else {
    console.log("Connected to MySQL database.");
  }
});



// Routes for Admin Functions

// 1. Create a new course
app.post("/admin/create-course", (req, res) => {
  const { name, description, instructor } = req.body;
  const query = "INSERT INTO courses (name, description, instructor) VALUES (?, ?, ?)";
  
  db.query(query, [name, description, instructor], (err, result) => {
    if (err) {
      console.error("Error creating course:", err);
      return res.status(500).json({ message: "Failed to create course." });
    }
    res.status(201).json({ message: "Course created successfully", courseId: result.insertId });
  });
});


// 2. Updating user grade
app.put("/admin/update-grade/:userId", (req, res) => {
  const userId = req.params.userId;
  const { grade } = req.body;
  const query = "UPDATE users SET grade = ? WHERE id = ?";
  
  db.query(query, [grade, userId], (err, result) => {
    if (err) {
      console.error("Error updating grade:", err);
      return res.status(500).json({ message: "Failed to update grade." });
    }
    res.status(200).json({ message: "Grade updated successfully" });
  });
});

// 3. Get all courses
app.get("/admin/courses", (req, res) => {
  const query = "SELECT * FROM courses";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.status(500).json({ message: "Failed to fetch courses." });
    }
    res.status(200).json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
