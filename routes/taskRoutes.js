const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const { authorize } = require('../middleware/auth');

const taskController = require('../controllers/taskController');

router.get('/', taskController.getUserTasks);
router.post('/', upload.single('file'), taskController.createTask);
router.put('/:id', upload.single('file'), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

router.get('/all', authorize('admin'), taskController.getAllTasks)

module.exports = router;
