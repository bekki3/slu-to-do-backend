const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection Error:", err));

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", TaskSchema);

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/api/tasks", async (req, res) => {
    try {
        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTaskData = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            updatedTaskData,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating task" });
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting task" });
    }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
