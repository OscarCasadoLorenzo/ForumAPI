'use strict'
var validator = require('validator');
var bcrypt = require('bcrypt');

var User = require('../models/user');
var jwt = require('../services/jwt');

var fs = require('fs'); //CRUD for files, internal nodeJS module
var path = require('path'); //Obtain absolute routes


const saltRounds = 10;

var controller = {
    save : function(req, res){

        //Catch request params
        var params = req.body;

        try{
            //Validate data
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        }catch(e){
            return res.status(400).send({
                msg: "Too few information."
            });
        }

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
                            msg : "New user register succed!",
                            user : userStored
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

        try{
            //Validate data
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch(e){
            return res.status(400).send({
                msg : "To few information."
            });
        }
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
                        token : jwt.createToken(issetUser),
                        user : issetUser
                    });
                }
                else{
                    return res.status(400).send({
                        msg : "Incorrect password!"
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
                    msg : "Error. Couldn't connect to DB."
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
    }, //close list controller

    get : function (req, res){
        User.findById(req.params.idUser,(err,issetUser)=>{
            if(err){
                return res.status(503).send({
                    msg : "Error. Couldn't connect to DB."
                })
            }

            if(!issetUser){
                return res.status(404).send({
                    msg : "Error. Couldn't find user."
                });
            }

            return res.status(200).send({
                user:issetUser
            });
        }); 
    },

    update : function (req, res) {
        //Pick up user info
        var params = req.body;

        try{
            //Validate data
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        }catch(e){
            return res.status(400).send({
                msg: "Too few information."
            });
        }

        //console.log(validate_name + validate_surname + validate_email + validate_password);

        //GUARD CLAUSE
        if(!validate_name || !validate_surname || !validate_email || !validate_password){
            return res.status(400).send({
                msg: "Form's data isn't valid."
            });
        }  

        //Check integrity o DB (email UK)
        User.findOne({email : params.email, _id : {$ne : req.user.sub}}, (err, issetUser) => {
            if(issetUser){
                return res.status(200).send({
                    msg : "Error. This email already exists."
                });
            }
            else{
                //New password should be encoded and loaded in DB
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(params.password, salt);
                params.password = hash;

                //Search & update DB register
                //function params: condition, data to update, options, callback
                User.findOneAndUpdate({_id: req.user.sub}, params, {new:true}, (err, userUpdated) => {
                    if(err){
                        return res.status(500).send({
                            msg : "Error. Couldn't connect to DB."
                        });
                    }

                    if(userUpdated){
                        return res.status(200).send({
                            msg : "User " + userUpdated._id + " update succes!"
                        });
                    } else{
                        return res.status(404).send({
                            msg : "Error. Couldn't find user in DB."
                        });
                    }
                });
            }
        }); 
            
    }, //close update controller

    uploadAvatar : function(req, res){
        //Configure multiparty module for upload images

        /* Multiparty middleware enables this param.
           Now if we cant to send any file, we have to
           put in Body > form-data
        */
        //console.log(req.files); 

        //Catch request file
        if(!req.files){
            return res.status(404).send({
                msg : "Error. No avatar image sended."
            });
        }

        //Name & extension
        var file_path = req.files.avatarFile.path;
        var file_split = file_path.split('/');  // **Advertising** On Windows, the splitter is '\\'

        var file_name = file_split[2];
        var file_ext = file_name.split('\.')[1];

        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'gift' && file_ext != 'jpeg'){
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    msg : "Error. Uploaded file must be an image (.png, .jpeg, .gift, .jpg)"
                });
            });
        } else{
            //Obtain user id
            var userId = req.user.sub;

            //Search and update the user
            User.findByIdAndUpdate(userId, {image : file_name}, {new : true}, (err, usserUpdated) => {
                if(err){
                    return res.status(500).send({
                        msg : "Error. Couldn't connect to DB."
                    });
                }

                return res.status(200).send({
                    msg : "User's avatar upload succes!"
                });
            });
        }        
    }, //close uploadAvatar

    avatar : function(req, res){
        var file_name = req.params.fileName;
        var path_file = './uploads/users/' + file_name;

        //fs.exists is DEPRECATED!!
        if(fs.existsSync(path_file)){
            return res.status(200).sendFile(path.resolve(path_file));
        } else{
            return res.status(404).send({
                msg : "Error. Image not found."
            });
        }       
    }
}

module.exports = controller;