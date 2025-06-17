require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const studentRoutes = require('./routes/students');
const codeforcesRoutes = require('./routes/codeforces');
const { syncCodeforcesData } = require('./services/codeforcesService');
const { checkInactiveStudents } = require('./services/emailService');
const { initializeCronJobs } = require('./config/cron');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); /* user for validating json */

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/codeforces', codeforcesRoutes);

// Initialize cron jobs
initializeCronJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));