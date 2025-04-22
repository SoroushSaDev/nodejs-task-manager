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
    const filePath = req.file ? req.file.path : null;

    if (!title)
        return res.status(400).json({error: 'Title is required'});

    try {
        const task = await Task.create({
            title,
            category,
            tags,
            user: req.user.userId,
            file: filePath,
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

    try {
        const task = await Task.findOneAndUpdate(
            {_id: id, user: req.user.userId},
            {
                title,
                completed,
                category,
                tags,
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
    const {id} = req.params;

    try {
        const task = await Task.findOneAndDelete({_id: id, user: req.user.userId});
        if (!task) return res.status(404).json({error: 'Task not found'});
        res.json(task);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to delete task',
            error: err.message,
        });
    }
};

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
