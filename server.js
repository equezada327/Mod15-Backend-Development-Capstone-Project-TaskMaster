// server.js

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables from .env
require('dotenv').config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((err) => console.error('❌ Connection error:', err));

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// ======= Middleware =======
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ======= Routes =======
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes')); // Add this once taskRoutes.js is ready

// ======= Root Route =======
app.get('/', (req, res) => {
  res.send('Welcome to the TaskMaster API!');
});

// ======= Start Server =======
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
