const express = require('express');
const {
    authenticateToken,
} = require('../../helpers/auth.helper');


const router = express.Router();

const taskController = require("../../controllers/task.controller");

router.route('/')
    .post(authenticateToken, taskController.createTask)
    .get(authenticateToken, taskController.getTasks)
router.route('/assign')
    .post(authenticateToken, taskController.addAssigneeToTask)
    .delete(authenticateToken, taskController.deleteAssigneeFromTask)

router.route('/:taskId')
    .put(authenticateToken, taskController.updateTask)
    .get(authenticateToken, taskController.getTaskById)


module.exports = router;

































