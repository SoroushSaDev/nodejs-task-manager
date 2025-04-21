const Task = require('../models/Task');

// GET /tasks
exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({user: req.user.userId});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch tasks',
            error: err.message,
        });
    }
};

// POST /tasks
exports.createTask = async (req, res) => {
    const {title} = req.body;

    if (!title) return res.status(400).json({error: 'Title is required'});

    try {
        const task = await Task.create({title, user: req.user.userId});
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
    const {title, completed} = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            {_id: id, user: req.user.userId},
            {title, completed},
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
