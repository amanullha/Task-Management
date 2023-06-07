const {
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    getAssignmentStatus
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