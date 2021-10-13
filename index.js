'use strict'
var mongoose = require('mongoose');

const conf = require('./config');
const app = require('./app');

//Sentencia para poder utilizar promesas
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/api_rest_node', {useNewUrlParser: true})
.then(() =>{
    console.log('DB connection ok');

    //Create server
    app.listen(conf.PORT, () => {
        console.log('Server http://localhost:3999 is running...');
    })
})
.catch(error => console.log(error))