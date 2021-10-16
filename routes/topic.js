'use strict'
var express = require('express');
var TopicController = require('../controllers/topic');

var router = express.Router();
var authenticated = require('../middlewares/authenticated');

router.post('/topic', authenticated.auth, TopicController.save);

//? means that page parameter is optional
router.get('/topics/:page?', TopicController.list);

module.exports = router;