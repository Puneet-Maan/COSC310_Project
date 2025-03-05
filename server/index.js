import express from 'express';
import cors from 'cors'; // Import CORS middleware
import pool from './routes/db.js'; // Import MySQL connection
import authRoutes from './routes/auth.js'; // Import authentication routes
import registerRoute from './routes/register.js'; // Import registration route
import editAccRoute from './routes/editAcc.js'; // Import edit account route
import waitlistRoute from './routes/waitlist.js'; // Import waitlist route


const app = express();
const port = 5001;

app.use(cors()); // Add CORS middleware
app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/api', authRoutes); // Use authentication routes under the /api path
app.use('/api/register', registerRoute); // Use registration route under the /api/register path
app.use('/api', editAccRoute); // Use edit account route under the /api path
app.use('/api', waitlistRoute); // Use waitlist route under the /api path


// Test route to check if the server is running
app.get("/api", (req, res) => {
  res.json({ "users": ["userOne", "userTwo", "userThree"] });
});

// Test route to check the database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW()'); // Query the database to get the current time
    res.json({ message: 'Database connected!', time: rows[0]}); // Respond with the current time
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: 'Database connection failed', error: err.message }); // Respond with an error message
  }
});

// Start the server on port 5001
app.listen(5001, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
