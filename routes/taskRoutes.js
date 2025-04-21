const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

router.get('/', taskController.getUserTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

router.get('/all', authorize('admin'), taskController.getAllTasks)

module.exports = router;
