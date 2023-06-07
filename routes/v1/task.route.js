const express = require('express');
const {
    authenticateToken,
} = require('../../helpers/auth.helper');


const router = express.Router();

const taskController = require("../../controllers/task.controller");

router.route('/')
    .post(authenticateToken,taskController.createTask)


module.exports = router;

































