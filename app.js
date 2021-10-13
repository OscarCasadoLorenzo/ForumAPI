'use strict'

var express = require('express');
const user = require('./models/user');

//Run express
var app = express();

//Load route files
var user_routes = require('./routes/user');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//CORS

//Rewrite routes
app.use('/whyme', user_routes);

//Export module
module.exports = app;
