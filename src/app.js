const express = require('express');
const authRoutes = require('./auth/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(express.json()); // Parse JSON bodies

app.use('/auth', authRoutes);
app.use('/tasks', authMiddleware, taskRoutes); // Protected

module.exports = app;
