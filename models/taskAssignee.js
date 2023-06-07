// TaskAssigneeSchema.js

const mongoose = require("mongoose");

// Define the Task Assignment schema
const TaskAssigneeSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  assignedIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

// Create the TaskAssignee model
const TaskAssignee = mongoose.model("TaskAssignee", TaskAssigneeSchema);

module.exports = TaskAssignee;
