'use strict'
var express = require('express');
var TopicController = require('../controllers/topic');

var router = express.Router();
var authenticated = require('../middlewares/authenticated');

router.post('/topics', authenticated.auth, TopicController.save);

//? means that page parameter is optional
router.get('/topics/:page?', TopicController.list);
router.get('/topics/user/:idUser', TopicController.getByUser);
router.get('/topic/:idTopic', TopicController.get);

router.put('/topics/:idTopic', authenticated.auth, TopicController.update)
router.delete('/topics/:idTopic', authenticated.auth, TopicController.delete)

module.exports = router;