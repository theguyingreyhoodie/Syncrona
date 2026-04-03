const Expense = require('../models/Expense');

// Get all expenses for a user
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new expense
exports.addExpense = async (req, res) => {
    try {
        const { title, amount, date } = req.body;
        const newExpense = new Expense({
            userId: req.user,
            title,
            amount: Number(amount),
            date: date ? new Date(date) : new Date()
        });
        const savedExpense = await newExpense.save();
        res.json(savedExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
