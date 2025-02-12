const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRoutes = require('./adminRoutes.js');  // Import  admin routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); 

// Routes
app.use('/admin', adminRoutes);  // Prefix all admin routes with /admin


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});