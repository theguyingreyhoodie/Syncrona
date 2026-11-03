const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ userId: req.user }).sort({ date: 1 });
        res.json(events);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.addEvent = async (req, res) => {
    try {
        const event = new Event({
            userId: req.user,
            title: req.body.title,
            date: req.body.date
        });
        const saved = await event.save();
        res.status(201).json(saved);
    } catch (e) {
        console.log("ERROR in addEvent:", e.message);
        res.status(500).json({ error: e.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const deleted = await Event.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!deleted) return res.status(404).json({ error: "Event not found" });
        res.json({ message: "Event deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
