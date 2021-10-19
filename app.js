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

/* 
    When we make AYAX request with jQuery or Angular
    to an API REST frecuently we will have problems
    with the CORS. 
    To solve it, we can add this middleware
*/
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Rewrite routes
app.use('/whyme', user_routes);
app.use('/whyme', topic_routes);
app.use('/whyme', comment_routes);

//Export module
module.exports = app;
