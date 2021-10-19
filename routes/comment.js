'use strict'

var express = require('express');
var CommentController = require('../controllers/comment');

var router = express.Router();
var authenticated = require('../middlewares/authenticated');

router.post('/topics/:idTopic', authenticated.auth, CommentController.save);
router.put('/topics/:idTopic/:idComment', authenticated.auth, CommentController.update);
router.delete('/topics/:idTopic/:idComment', authenticated.auth, CommentController.delete);

module.exports = router;