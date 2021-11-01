'use strict'

var express = require('express');
var logger = require('morgan');
var fs = require('fs');

var swaggerUI = require('swagger-ui-express');
var swaggerFile = require('./others/swagger_doc.json');

//Run express
var app = express();

//Load route files
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');
var comment_routes = require('./routes/comment');
var cors = require('cors');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(logger('common', {
    stream: fs.createWriteStream('./others/access.log', {flags: 'a'})
}));
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
/* 
    When we make AYAX request with jQuery or Angular
    to an API REST frecuently we will have problems
    with the CORS. Specifficly when server or port
    is different between client and server.
    To solve it, we can add this middleware
*/
app.use(cors());

//Rewrite routes
app.use('/whyme', user_routes);
app.use('/whyme', topic_routes);
app.use('/whyme', comment_routes);

//Export module
module.exports = app;
