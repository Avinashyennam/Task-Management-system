const Task = require("../models/task");
const User = require("../models/user");

const createTask = async (req, res) =>{
  try {

    const { title, description, dueDate, priority, status, assignedTo } = req.body;
    console.log(req.body);
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(404).json({ message: 'Assigned user not found' });
      }
    }

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: req.user.id,
    };

    if(assignedTo && assignedTo.trim() !== ''){
      taskData.assignedTo = assignedTo;
    }

    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const getTasks = async (req, res)=>{
  try {
    const tasks = await Task.find({ 
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }]
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {createTask, getTasks, getTask, updateTask, deleteTask}