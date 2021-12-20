'use strict'
var mongoose = require('mongoose');

const conf = require('./config');
const app = require('./app');
const config = require('./config');

//Sentencia para poder utilizar promesas
mongoose.Promise = global.Promise;

mongoose.connect(config.ATLAS_DB, {useNewUrlParser: true})
.then(() =>{
    console.log('DB connection ok');

    //Create server
    app.listen(conf.PORT, () => {
        console.log('Server http://localhost:3999 is running...');
    })
})
.catch(err => console.error(Error, err.message))