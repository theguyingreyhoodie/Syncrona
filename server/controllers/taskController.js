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
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!task) return res.status(404).json({ msg: "Task not found" });
        res.json({ msg: "Task deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// TOGGLE COMPLETE
exports.toggleTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user });
        if (!task) return res.status(404).json({ msg: "Task not found" });
        // Use the state the client asked for; fall back to a plain toggle.
        task.completed = typeof req.body?.completed === "boolean" ? req.body.completed : !task.completed;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};