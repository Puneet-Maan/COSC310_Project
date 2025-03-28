const express = require('express');
const cors = require('cors'); // Import CORS middleware

const app = express();
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const courseGeneralRoutes = require('./routes/courses/general'); // Updated path
const courseEnrollmentRoutes = require('./routes/courses/enrollment'); // Updated path
const courseWaitlistRoutes = require('./routes/courses/waitlist'); // Updated path
const calendarRoutes = require('./routes/calendar');
const adminRoutes = require('./routes/admin');
const printReport = require('./routes/printReport'); // Updated path

// Enable CORS for all origins
app.use(cors());

// For parsing JSON request bodies
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/courses', courseGeneralRoutes);
app.use('/courses', courseEnrollmentRoutes);
app.use('/courses', courseWaitlistRoutes);
app.use('/calendar', calendarRoutes);
app.use('/admin', adminRoutes);
app.use('/enrollments', courseEnrollmentRoutes); // Register only once
app.use('/report', printReport); // Updated path
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Catch-all route for unhandled requests
app.use((req, res) => {
  console.log(`Unhandled request: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Not Found' });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
