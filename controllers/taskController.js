const fs = require('fs');
const path = require('path');

const Task = require('../models/Task');

// GET /tasks
exports.getUserTasks = async (req, res) => {
    const {page = 1, limit = 10, completed, title} = req.query

    const query = {user: req.user.userId}
  
    if (completed !== undefined) {
      query.completed = completed === 'true'
    }
  
    if (title) {
      query.title = {$regex: title, $options: 'i'} // case-insensitive search
    }

    if (req.query.category) {
        query.category = req.query.category
    }
      
    if (req.query.tags) {
        const tagsArray = req.query.tags.split(',') // e.g. tags=urgent,home
        query.tags = {$in: tagsArray}
    }
  
    const skip = (parseInt(page) - 1) * parseInt(limit)
  
    try {
      const tasks = await Task.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
  
      const total = await Task.countDocuments(query)
  
      res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        tasks,
      })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
};

// POST /tasks
exports.createTask = async (req, res) => {
    const {title, category, tags} = req.body;
    const filePaths = req.files ? req.files.map(file => file.path) : [];

    if (!title)
        return res.status(400).json({error: 'Title is required'});

    try {
        const task = await Task.create({
            title,
            category,
            tags,
            user: req.user.userId,
            files: filePaths,
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create task',
            error: err.message,
        });
    }
};

// PUT /tasks/:id
exports.updateTask = async (req, res) => {
    const {id} = req.params;
    const {title, completed, category, tags} = req.body;
    const filePaths = req.files ? req.files.map(file => file.path) : [];

    try {
        const task = await Task.findOneAndUpdate(
            {_id: id, user: req.user.userId},
            {
                title,
                completed,
                category,
                tags,
                files: filePaths,
            },
            {new: true}
        );
        if (!task)
            return res.status(404).json({error: 'Task not found'});
        res.json(task);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to update task',
            error: err.message,
        });
    }
};

// DELETE /tasks/:id
exports.deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id)
  
    if (!task)
        return res.status(404).json({ message: 'Task not found' })

    // Delete associated files
    task.files.forEach(filePath => {
        const fullPath = path.join(__dirname, '..', filePath)
        fs.unlink(fullPath, err => {
            if (err) console.error('Error deleting file:', err)
        })
    })
  
    await task.deleteOne();
  
    res.status(200).json({ message: 'Task and files deleted' })
  }

// GET /tasks/all
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('user', 'name email')
        res.json(tasks)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch tasks',
            error: err.message,
        })
    }
};
