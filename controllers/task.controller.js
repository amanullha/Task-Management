const {
    createTask,
    updateTask,
    getTaskById,
    getTaskStatus,
    deleteTask,
    addAssigneeToTask,
    getTasks,
    deleteAssigneeFromTask
} = require('../services/task.service')
exports.createTask = async (req, res, next) => {
    try {
        const user = req.user;
        const data = req.body;
        const result = await createTask(data, user);
        res.status(200).send({
            success: true,
            message: "Task created successfully!!",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}
exports.getTasks = async (req, res, next) => {
    try {
        const { search, ...query } = req.body;
        const result = await getTasks(query, search);
        res.status(200).send({
            success: true,
            message: "Task created successfully!!",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}
exports.updateTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const data = req.body;
        const result = await updateTask(taskId, data);
        res.status(200).send({
            success: true,
            message: "Task updated successfully!!",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}
exports.addAssigneeToTask = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const taskId = req.body.taskId;
        const result = await addAssigneeToTask(taskId, userId);
        res.status(200).send({
            success: true,
            message: "Assigned successfully!!",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}
exports.deleteAssigneeFromTask = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const taskId = req.body.taskId;
        const result = await deleteAssigneeFromTask(taskId, userId);
        res.status(200).send({
            success: true,
            message: "Remove successfully!!",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}
exports.getTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const result = await getTaskById(taskId);
        res.status(200).send({
            success: true,
            message: "Task fetched successfully!!",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}