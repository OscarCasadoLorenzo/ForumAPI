

var mongoose = require('mongoose');

//Sentencia para poder utilizar promesas
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/api_rest_node', {useNewUrlParser: true})
.then(() =>{
    console.log('Conexión a BD OK')
})
.catch(error => console.log (error))