const Task = require("../models/task");
// const User = require("../models/user");

const assignedTasks = async (req, res) =>{
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

const createdTasks = async (req, res) =>{
  try {
    const tasks = await Task.find({ createdBy: req.user.id});
    res.json({tasks});
  } catch (error) {
    res.status(500).json({message: 'Server errir'});
  }
}

const overdueTasks = async (req, res)=>{
  try {
    const now = new Date();
    const tasks = await Task.find({
      assignedTo: req.user.id,
      dueDate: { $lt: now },
      status: { $ne: 'Completed' }
    });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {assignedTasks, createdTasks, overdueTasks};