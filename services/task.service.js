
const { default: mongoose } = require('mongoose');
const { TaskStatus } = require('../enums/taskStatus.enum');
const TaskModel = require('../models/task');
const TaskAssigneeModel = require('../models/taskAssignee');
const { getOneUser } = require('../services/user.service')
// Create a new task
async function createTask(data, user) {
    try {
        const taskObj = await constructTaskObject(data, user);
        const res = await TaskModel.create(taskObj);
        const newTask = await res.toObject();
        if (newTask) {
            const assignee = await addAssigneeToTask(newTask._id, user._id)
        }
        return newTask;
    } catch (error) {
        throw new Error(error?.message);
    }
}

async function addAssigneeToTask(taskId, userId) {
    const task = await getTaskById(taskId);
    const user = await getOneUser(userId);
    if (user && task) {
        let assigneeObj = {
            taskId: taskId ?? '',
            assignedIds: [userId]
        }
        const data = await TaskAssigneeModel.find({ taskId: taskId }).lean();
        const existTask = data.length > 0 ? data[0] : {};
        let updatedAssigneeList;
        if (existTask?._id) {
            // const existingIds = existTask.assignedIds
            // let allIds=[userId];
            // for(let i=0;i<existingIds?.length;i++){
            //     allIds.push(existingIds[i]);
            // }
            existTask.assignedIds.push(userId)
            const uniqueIds = [...new Set(existTask.assignedIds)];
            updatedAssigneeList = await TaskAssigneeModel.updateMany(
                { taskId: taskId },
                { $set: { assignedIds: uniqueIds } }
            );
        }
        else {
            const res = await TaskAssigneeModel.create(assigneeObj);
            updatedAssigneeList = await res.toObject();
        }
        return updatedAssigneeList;


    } else {
        throw new Error('Failed to add new assignee');
    }
}
async function deleteAssigneeFromTask(taskId, userId) {
    const task = await getTaskById(taskId);
    const user = await getOneUser(userId);
    if (user && task) {
        let assigneeObj = {
            taskId: taskId ?? '',
            assignedIds: [userId]
        }
        const data = await TaskAssigneeModel.find({ taskId: taskId }).lean();
        const existTask = data.length > 0 ? data[0] : {};
        let updatedAssigneeList;
        if (existTask?._id) {
            let uniqueIds = existTask.assignedIds.filter(id => id !== userId);
            updatedAssigneeList = await TaskAssigneeModel.updateMany(
                { taskId: taskId },
                { $set: { assignedIds: uniqueIds } }
            );
        }
        else {
            const res = await TaskAssigneeModel.create(assigneeObj);
            updatedAssigneeList = await res.toObject();
        }
        return updatedAssigneeList;


    } else {
        throw new Error('Failed to add new assignee');
    }
}
async function getTasks(queries, search) {
    try {
        const { dueDate, status, assignedUser, sortBy } = queries;
        const query = {};
        if (dueDate) {
            query.dueDate = dueDate;
        }
        if (status) {
            query.status = status;
        }

        if (assignedUser) {
            const taskIds = await getUserAssignTasks(assignedUser)
            query._id = { $in: taskIds };
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Build the sort object based on the sortBy parameter
        let sort = {};

        if (sortBy === 'dueDate') {
            sort = { dueDate: 1 };
        } else if (sortBy === 'createdAt') {
            sort = { createdAt: 1 };
        }
        else if (sortBy === 'updatedAt') {
            sort = { updatedAt: 1 };
        }

        let data = await TaskModel.find(query)
            .sort(sort)
            .maxTimeMS(20000)
        let tasks = [];
        for (let i = 0; i < data?.length; i++) {
            let task = data[i].toObject();
            task['assignedIds'] = await getAssigneeIdsOfTask(task._id);
            tasks.push(task);
        }
        return tasks;
    } catch (error) {
        console.error(error);
        return error.message;
    }
}
async function getUserAssignTasks(userId) {
    const query = {
        assignedIds: userId
    };
    const tasks = await TaskModel.find(query).select('_id');
    const taskIds = tasks.map(task => task._id.toString());
    return taskIds;
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
        status: newData.status ?? oldData.status,
    }
    return task;
}

// Update an existing task
async function updateTask(taskId, data) {
    try {
        const existAssignedTask = await TaskModel.findById(taskId).lean().exec();
        if (existAssignedTask) {
            const updateObj = await constructUpdateTaskObject(data, existAssignedTask)
            const updatedTask = await TaskModel.findByIdAndUpdate(
                taskId,
                updateObj,
                { new: true }
            ).lean().exec();

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


// Get the assignment status of a task
async function getTaskStatus(taskId) {
    try {
        const task = await getTaskById(taskId);

        if (!task) {
            throw new Error('Task not found');
        }

        return task?.status;
    } catch (error) {
        throw new Error('Failed to get assignment status');
    }
}

async function getAssigneeIdsOfTask(taskId) {
    const assigneeTasks = await TaskAssigneeModel.find({ taskId: taskId.toString() }).lean().exec();
    if (assigneeTasks?.length > 0) return assigneeTasks[0]?.assignedIds;
    else return [];
}
async function getTaskById(taskId) {
    try {
        if (taskId) {
            let task = await TaskModel.findById(taskId).lean().exec();
            if (!task) {
                throw new Error('Task not found');
            }
            const assignedIds = await getAssigneeIdsOfTask(task?._id.toString())
            task['assignedIds'] = assignedIds;
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
    getTaskById,
    getTaskStatus,
    deleteTask,
    addAssigneeToTask,
    getTasks,
    deleteAssigneeFromTask
};
