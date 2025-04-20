const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', authRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);

app.use(notFound)
app.use(errorHandler)

module.exports = app;
