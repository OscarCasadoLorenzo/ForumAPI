'use strict'
var validator = require('validator');
var bcrypt = require('bcrypt');

var User = require('../models/user');
var jwt = require('../services/jwt');

const saltRounds = 10;

var controller = {
    save : function(req, res){
        //Catch request params
        var params = req.body;

        //Validate data
        var validate_name = !validator.isEmpty(params.name);
        var validate_surname = !validator.isEmpty(params.surname);
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);
        
        //console.log(validate_name + validate_surname + validate_email + validate_password);

        //GUARD CLAUSE
        if(!validate_name || !validate_surname || !validate_email || !validate_password){
            return res.status(400).send({
                msg: "Form's data isn't valid."
            });
        }  

        //Create user object
        var newUser = new User();

        //Add values to object
        newUser.email = params.email.toLowerCase();
        newUser.name = params.name;
        newUser.surname = params.surname;
        newUser.role = 'ROLE_USER';
        newUser.image = null;

        //Verify if user exists
        User.findOne({email : newUser.email}, (err, issetUser) => {
            if(err){
                return res.status(500).send({
                    msg : "Error. Couldn't connect to DB."
                });
            }

            if(!issetUser){
                //Encrypt password
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(params.password, salt);
                newUser.password = hash;

                //Add to DB
                newUser.save((err, userStored) => {
                    if(err){
                        return res.status(503).send({
                            msg : "Error. Couldn't store user in DB."
                        });
                    }
                    if(userStored){
                        return res.status(201).send({
                            msg : "New user register succed!"
                        });
                    }
                })

            } else{
                return res.status(500).send({
                    msg : "Error. Usuario already exists."
                });
            }
        }); //close findOne(user)
    }, // close save controller

    login : function (req, res){
        //Catch request params
        var params = req.body;

        //Validate data
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);

        if(!validate_email || !validate_password){
            return res.status(400).send({
                msg: "Form's data isn't valid."
            });
        }

        //Search user matches
        User.findOne({email : params.email.toLowerCase()}, (err, issetUser) =>{
            if(err){
                return res.status(500).send({
                    msg : "Error. Couldn't connect to DB."
                });
            }   
            
            if(issetUser){
                //Compare password
                if(bcrypt.compareSync(params.password, issetUser.password)){
                    //Generar el token JWT
                    return res.status(200).send({
                        token : jwt.createToken(issetUser)
                    });
                }
                else{
                    return res.status(400).send({
                        msg : "Form's data isn't valid."
                    });
                }

            } else{
                return res.status(404).send({
                    msg : "Error. Couldn't find user."
                });
            }
        });
    }, //close login controller

    list : function (req, res){
        User.find({},(err,issetUsers)=>{
            if(err){
                return res.status(503).send({
                    msg : "Error. Couldn't store user in DB."
                })
            }

            if(!issetUsers){
                return res.status(404).send({
                    msg : "Error. Couldn't find users."
                });
            }

            return res.status(200).send({
                users:issetUsers
            });
        }); 
    } //close list controller
}

module.exports = controller;