const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.get('/', UserController.findAllUser);
router.get('/:userId', UserController.findAllUserId);
router.post('/', UserController.addUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

router.post('/login', UserController.login);

module.exports = router;