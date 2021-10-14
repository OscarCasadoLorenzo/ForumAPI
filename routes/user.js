'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var authenticated = require('../middlewares/authenticated');

router.get('/users', UserController.list);
router.post('/register', UserController.save);
router.post('/login', UserController.login);

//Route protected by auth middleware
router.put('/update', authenticated.auth ,UserController.update)
module.exports = router;