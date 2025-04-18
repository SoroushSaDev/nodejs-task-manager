const Task = require('../models/Task');

// GET /tasks
exports.getAllTasks = async (req, res) => {
    const userId = req.user.userId;

    try {
        const tasks = await Task.find({user: userId});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch tasks'});
    }
};

// POST /tasks
exports.createTask = async (req, res) => {
    const userId = req.user.userId;
    const {title} = req.body;

    if (!title) return res.status(400).json({error: 'Title is required'});

    try {
        const task = await Task.create({title, user: userId});
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({error: 'Failed to create task'});
    }
};

// PUT /tasks/:id
exports.updateTask = async (req, res) => {
    const userId = req.user.userId;
    const {id} = req.params;
    const {title, completed} = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            {_id: id, user: userId},
            {title, completed},
            {new: true}
        );
        if (!task)
            return res.status(404).json({error: 'Task not found'});
        res.json(task);
    } catch (err) {
        res.status(500).json({error: 'Failed to update task'});
    }
};

// DELETE /tasks/:id
exports.deleteTask = async (req, res) => {
    const userId = req.user.userId;
    const {id} = req.params;

    try {
        const task = await Task.findOneAndDelete({_id: id, user: userId});
        if (!task) return res.status(404).json({error: 'Task not found'});
        res.json(task);
    } catch (err) {
        res.status(500).json({error: 'Failed to delete task'});
    }
};
