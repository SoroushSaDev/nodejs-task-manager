let tasks = [
    { id: 1, title: 'First Task', completed: false },
    { id: 2, title: 'Second Task', completed: true }
  ];
  
  // GET /tasks
  exports.getAllTasks = (req, res) => {
    res.json(tasks);
  };
  
  // POST /tasks
  exports.createTask = (req, res) => {
    const { title } = req.body;
  
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
  
    const newTask = {
      id: tasks.length + 1,
      title,
      completed: false
    };
  
    tasks.push(newTask);
    res.status(201).json(newTask);
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
