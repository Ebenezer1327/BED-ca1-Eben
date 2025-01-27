const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.get('/', userController.listUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
module.exports = router;
