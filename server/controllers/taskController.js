const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        const { title, dueDate } = req.body;

        const task = await Task.create({
            title,
            dueDate,
            userId: req.user
        });

        res.json(task);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// GET USER TASKS
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: "Task deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// TOGGLE COMPLETE
exports.toggleTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.completed = !task.completed;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};