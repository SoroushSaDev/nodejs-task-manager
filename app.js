const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const mailRoutes = require('./routes/mailRoutes');

const { protect, authorize } = require('./middleware/auth');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', authRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/tasks', protect, taskRoutes);
app.use('/api/users', protect, authorize('admin'), userRoutes);

app.use(notFound)
app.use(errorHandler)

module.exports = app;
