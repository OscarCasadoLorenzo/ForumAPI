'use strict'

const config = require ('../config')
const jwt = require ('jwt-simple')
const moment = require('moment')

exports.auth = function (req, res, next) {
    //Check if request comes with authorization token
    if(!req.headers.authorization){
        return res.status(403).send({
            msg : 'Error. You must be logged to access here.'
        });
    }

    //Clean token
    var token = req.headers.authorization.replace(/['"]+/g, '');

    //Decode token
    try{
        var payload = jwt.decode(token, config.SECRET_TOKEN);

        //Expiration time its ok?
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                msg: 'Error. Token time expired, need to login again.'
            })
        }

        //Add user info to request
        req.user = payload;

    } catch(e){
        return res.status(404).send({
            msg: 'Error. Something went wrong with token validation.'
        })
    }

    //Continue with the controller
    next();
}