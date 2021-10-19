'use strict'

var express = require('express');
const user = require('./models/user');

//Run express
var app = express();

//Load route files
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');
var comment_routes = require('./routes/comment');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//CORS

//Rewrite routes
app.use('/whyme', user_routes);
app.use('/whyme', topic_routes);
app.use('/whyme', comment_routes);

//Export module
module.exports = app;
