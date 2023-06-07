const express = require('express');
const {
    authenticateToken,
} = require('../../helpers/auth.helper');


const router = express.Router();

const userController = require("../../controllers/user.controller");

router.route('/')
    .get(authenticateToken, userController.getAllUsers)
    .post(userController.createUser)
router.route('/signup')
    .post(userController.createUser)
router.route('/login')
    .post(userController.loginUser)
router.route('/replace-token')
    .get(userController.replaceToken)


// router.route('/:id')
//     .get(userController.getUserById)
//     .patch(userController.updateUserById)

module.exports = router;

































