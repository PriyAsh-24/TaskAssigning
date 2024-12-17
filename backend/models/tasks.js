const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    details: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
}, { timestamps: true });

const Task = mongoose.model("tasks", taskSchema);
module.exports = Task;