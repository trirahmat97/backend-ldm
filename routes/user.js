const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const authKey = require('../middleware/ApiKey');
const OAuth = require('../middleware/OauthVerify');

router.get('/', OAuth.verification, UserController.findAllUser);
router.get('/:userId', UserController.findAllUserId);
router.post('/', UserController.addUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

router.post('/login', UserController.login);

module.exports = router;