const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const upload = require('../middleware/upload');

router.get('/', userController.getAllUsers);
router.post('/', upload.single('file'), userController.createUser);
router.put('/:id', upload.single('file'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
