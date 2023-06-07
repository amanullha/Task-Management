
const { default: mongoose } = require('mongoose');
const { TaskStatus } = require('../enums/taskStatus.enum');
const TaskModel = require('../models/task');
const TaskAssigneeModel = require('../models/taskAssignee');
const { getOneUser } = require('../services/user.service')
// Create a new task
async function createTask(data, user) {
    try {
        const taskObj = await constructTaskObject(data, user);
        const newTask = await TaskModel.create(taskObj);
        if (newTask) {
            const assignee = await addAssigneeToTask(newTask._id, user._id)
        }
        return newTask;
    } catch (error) {
        throw new Error('Failed to create task');
    }
}
async function addAssigneeToTask(taskId, userId) {
    const task = await getTaskById(taskId);
    const user = await getOneUser(userId);
    if (user && task) {
        let assigneeObj = {
            taskId: String(taskId) ?? '',
            assignedIds: [String(userId)]
        }
        const existTask = await TaskAssigneeModel.find({ taskId: taskId });
        let updatedAssigneeList;
        if (existTask?._id) {
            assigneeObj.assignedIds = [...new Set(...existTask.assignedIds, String(userId))];
            updatedAssigneeList = await TaskAssigneeModel.findByIdAndUpdate({ taskId: String(taskId) }, assigneeObj)
        }
        else {
            updatedAssigneeList = await TaskAssigneeModel.create(assigneeObj);
        }
        return updatedAssigneeList;


    } else {
        throw new Error('Failed to add new assignee');
    }
}
async function constructTaskObject(data, user) {
    const dueDate = new Date(data?.dueDate);
    const task = {
        title: data.title ?? "",
        description: data.description ?? "",
        dueDate: dueDate ?? new Date(),
        status: TaskStatus.InProgress,
        assignedCreator: user._id ?? '',
    }
    return task;
}
async function constructUpdateTaskObject(newData, oldData) {
    const dueDate = new Date(newData?.dueDate);
    const task = {
        title: newData.title ?? oldData.title,
        description: newData.description ?? oldData.description,
        dueDate: dueDate ?? oldData.dueDate,
        status: newDate.status ?? oldData.status,
    }
    return task;
}

// Update an existing task
async function updateTask(taskId, data) {
    try {
        const existAssignedTask = await TaskModel.findById(taskId);
        if (existAssignedTask) {
            const updateObj = constructUpdateTaskObject(data, existAssignedTask)
            const updatedTask = await TaskModel.findByIdAndUpdate(
                taskId,
                updateObj,
                { new: true }
            );

            if (!updatedTask) {
                throw new Error('Task not found');
            }
            return updatedTask;
        }
        else {
            throw new Error('Task not found');
        }
    } catch (error) {
        throw new Error('Failed to update task');
    }
}

// Delete a task
async function deleteTask(taskId) {
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(taskId);

        if (!deletedTask) {
            throw new Error('Task not found');
        }
        return deletedTask;
    } catch (error) {
        throw new Error('Failed to delete task');
    }
}

// Assign a task to a user
async function assignTask(taskId, assignedUserId) {
    try {
        const existAssignedTask = await TaskModel.findById(taskId);
        if (existAssignedTask) {
            const updateObj = constructTaskObject(existAssignedTask)
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                updateObj,
                { new: true }
            );

            if (!updatedTask) {
                throw new Error('Task not found');
            }

            return updatedTask;
        }
        else {
            throw new Error('Task not found');
        }

    } catch (error) {
        throw new Error('Failed to assign task');
    }
}

// Get the assignment status of a task
async function getAssignmentStatus(taskId) {
    try {
        const task = await Task.findById(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        return task.assignedTo ? 'Assigned' : 'Unassigned';
    } catch (error) {
        throw new Error('Failed to get assignment status');
    }
}
async function getTaskById(taskId) {
    try {
        if (taskId) {
            const task = await TaskModel.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            return task;
        }
        else {
            throw new Error("invalid taskId");
        }
    } catch (error) {
        throw new Error('Failed to get task: ' + error.message);
    }
}

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    getAssignmentStatus
};
