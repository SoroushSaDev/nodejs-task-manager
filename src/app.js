const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./auth/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(express.json()); // Parse JSON bodies

app.use('/auth', authRoutes);
app.use('/tasks', authMiddleware, taskRoutes); // Protected

module.exports = app;
