'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var authenticated = require('../middlewares/authenticated');

//It will permit to transfer files by HTTP protocol
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir : './uploads/users'});

router.get('/users', UserController.list);
router.get('/user/:idUser', UserController.get);
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.get('/avatar/:fileName', UserController.avatar);

//Route protected by auth middleware
router.put('/update', authenticated.auth, UserController.update);
router.post('/upload-avatar/:id', [authenticated.auth, md_upload], UserController.uploadAvatar);
module.exports = router;