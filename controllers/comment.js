'use strict'

var validator = require('validator');
var Topic = require('../models/topic'); 

var controller = {
    save : function(req, res){
        var params = req.body;

        Topic.findById(req.params.idTopic, (err, issetTopic) => {
            if(err){
                return res.status(500).send({
                    msg: "Error. Couldnt connect to DB."
                });
            }

            if(!issetTopic){
                return res.status(404).send({
                    msg: "Error. Topic doesnt exist, then you cant post a comment."
                });
            }

            //Validate information
            try{
                //Validate data
                var validate_content = !validator.isEmpty(params.content);
            }catch(e){
                return res.status(400).send({
                    msg: "Too few information."
                });
            }
    
            //GUARD CLAUSE
            if(!validate_content ){
                return res.status(400).send({
                    msg: "Form's data isn't valid."
                });
            }  

            //Associate values to new comment
            var newComment = {
                user : req.user.sub,
                content : params.content
            }

            issetTopic.comments.push(newComment);

            //Save comment
            issetTopic.save((err, commentStored) => {
                if(err){
                    return res.status(503).send({
                        msg : "Error. Couldn't store comment in DB."
                    });
                }
                if(commentStored){
                    return res.status(201).send({
                        msg : "New comment register succed!"
                    });
                }
            });           
        });
    }, //close save controller

    update : function(req, res){
        var params = req.body;

        //Validate information
        try{
            //Validate data
            var validate_content = !validator.isEmpty(params.content);
        }catch(e){
            return res.status(400).send({
                msg: "Too few information."
            });
        }

        //GUARD CLAUSE
        if(!validate_content ){
            return res.status(400).send({
                msg: "Form's data isn't valid."
            });
        } 

        Topic.findOneAndUpdate({"comments._id" : req.params.idComment}, 
                                {"$set" : {"comments.$.content" : params.content}},   
                                {new:true},                                 
                                (err, updatedTopic) => {
            
            if(err){
                return res.status(500).send({
                    msg: "Error. Couldnt connect to DB." + err.message
                });
            }

            if(!updatedTopic){
                return res.status(404).send({
                    msg: "Error. Comment doesnt exist, then you cant update it."
                });
            }    

            return res.status(200).send({
                msg: "Comment updated successfully.",
            });

        });
    }, //close update controller

    delete : function(req, res){
        var params = req.body;
        
        Topic.findById(req.params.idTopic, (err, issetTopic) => {
            
            if(err){
                return res.status(500).send({
                    msg: "Error. Couldnt connect to DB." + err.message
                });
            }

            if(!issetTopic){
                return res.status(404).send({
                    msg: "Error. Topic doesnt exist."
                });
            }

            var comment = issetTopic.comments.id(req.params.idComment);
            
            if(!comment){
                return res.status(404).send({
                    msg: "Error. Comment doesnt exist."
                });
            }

            if(req.user.sub != comment.user){
                return res.status(403).send({
                    msg: "Error. You cant delete this comment."
                });
            }

            comment.remove();
            issetTopic.save();

            return res.status(200).send({
                msg: "Comment deleted succesfully."
            });
        });
    } //close delete controller
}

module.exports = controller;