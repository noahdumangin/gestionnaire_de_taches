const mongoose = require("mongoose");

//création de la base de donnée
const Task = new mongoose.Schema({
    title: { type: String, required: true },
    status: {type: String, enum: ["todo", "in_progress", "done"], required: true },
    createdAt: { type: Date, default: Date.now }
});

Task.index({ createdAt: 1 });

module.exports = mongoose.model("Task", Task);