const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// One shared connection, opened on first use. On Vercel each function
// instance reuses it across requests instead of reconnecting every time.
let dbReady = null;
function connectDb() {
    if (!process.env.MONGO_URI) return Promise.reject(new Error("MONGO_URI is not set"));
    if (!dbReady) {
        dbReady = mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
            .then(() => console.log("MongoDB connected"))
            .catch((err) => { dbReady = null; throw err; });
    }
    return dbReady;
}

app.use("/api", async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (err) {
        console.error("Database connection failed:", err.message);
        res.status(503).json({ msg: "Service unavailable. Please try again shortly." });
    }
});

// routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const noteRoutes = require("./routes/noteRoutes");
const eventRoutes = require("./routes/eventRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/expenses", expenseRoutes);

// test route
app.get("/", (req, res) => {
    res.send("API running...");
});

const PORT = process.env.PORT || 5000;

// Locally, run a normal server. On Vercel the exported app is the handler.
if (require.main === module) {
    connectDb()
        .then(() => app.listen(PORT, () => console.log("Server running on port " + PORT)))
        .catch((err) => { console.error(err.message); process.exit(1); });
}

module.exports = app;
