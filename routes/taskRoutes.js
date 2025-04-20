const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

router.get('/all', protect, authorize('admin'), async (req, res) => {
    try {
      const tasks = await Task.find().populate('user', 'name email')
      res.json(tasks)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

module.exports = router;
