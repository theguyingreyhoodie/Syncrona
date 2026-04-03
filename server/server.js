const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

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

// connect mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log("Server running on port " + PORT);
            });
        }
    })
    .catch(err => console.log(err));

module.exports = app;