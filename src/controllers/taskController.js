const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
  
// GET /tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: true }
    })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};
  
// POST /tasks
exports.createTask = async (req, res) => {
  const { title, description, userId } = req.body
  try {
    const task = await prisma.task.create({
      data: { title, description, userId }
    })
    res.status(201).json(task)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
};

// PUT /tasks/:id
exports.updateTask = (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
  
    const task = tasks.find(t => t.id === parseInt(id));
  
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
  
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
  
    res.json(task);
  };
  
// DELETE /tasks/:id
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(index, 1);
  res.json(deletedTask[0]);
};
