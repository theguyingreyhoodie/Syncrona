const Note = require("../models/Note");

// CREATE NOTE
exports.createNote = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ msg: "Content is required" });

        const note = await Note.create({
            content,
            userId: req.user
        });
        res.json(note);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// GET USER NOTES
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// UPDATE NOTE
exports.updateNote = async (req, res) => {
    try {
        const { content } = req.body;
        const note = await Note.findById(req.params.id);

        if (!note || note.userId.toString() !== req.user) {
            return res.status(404).json({ msg: "Note not found or unauthorized" });
        }

        note.content = content || note.content;
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// DELETE NOTE
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note || note.userId.toString() !== req.user) {
            return res.status(404).json({ msg: "Note not found or unauthorized" });
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ msg: "Note deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};
