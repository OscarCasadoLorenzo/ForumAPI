'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var controller = {

    save : function(req, res){
        //Catch request params
        var params = req.body;

        try{
            //Validate data
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        }catch(e){
            return res.status(400).send({
                msg: "Too few information."
            });
        }

        //GUARD CLAUSE
        if(!validate_title || !validate_content || !validate_lang){
            return res.status(400).send({
                msg: "Form's data isn't valid."
            });
        }  

        //Create user object
        var newTopic = new Topic();

        //Add values to object
        newTopic.title = params.title;
        newTopic.content = params.content;
        newTopic.lang = params.lang;
        newTopic.code = params.code;
        newTopic.user = req.user.sub;

       newTopic.save((err, topicStored) => {
           if(err){
                return res.status(500).send({
                    msg : "Error. Couldnt connect to DB."
                });
            }

            return res.status(201).send({        
                msg : "Topic post succed!"     
            });
       })
    }, //close save controller

    list : function(req, res){
        //Charge paginate library on TopicSchema

        //Actual page
        var pageNum = 0;
        if(!req.params.page)
            pageNum = 1;
        else pageNum = parseInt(req.params.page);

        //Select paginate configuration
        const paginateOptions = {
            sort : {date : -1}, //newest to older
            populate :'user', //allows mongoose to introduce full user object,
            limit : 5, //topics per page
            page: pageNum
        }

        //Paginate find
        Topic.paginate({}, paginateOptions, (err,issetTopics) => {
            if(err){
                return res.status(503).send({
                    msg : "Error. Couldn't connect to DB."
                })
            }

            if(!issetTopics){
                return res.status(404).send({
                    msg : "Error. Couldn't find topics."
                });
            }

            //We have to return actualTopics, totalTopics and totalPages
            return res.status(200).send({
                totalPages : issetTopics.totalPages,
                totalTopics : issetTopics.totalDocs,
                topics : issetTopics.docs
            });
        }); 
    }, //close list controller

    getByUser : function(req, res){
        var userID = req.params.userID;

        Topic.find({
            user: userID
        })
        .sort([['date', 'descending']])
        .exec((err, issetTopics) => {
            if(err){
                return res.status(503).send({
                    msg : "Error. Couldn't connect to DB."
                })
            }

            if(!issetTopics){
                return res.status(404).send({
                    msg : "Error. User " + userID + " have no topics." 
                });
            }

            return res.status(200).send({
                topics : issetTopics
            });
        });
    }, //close getByUser

    get : function(req, res){
        var idTopic = req.params.idTopic;

        Topic.findById(idTopic)
        .populate('user')
        .exec((err, issetTopic) => {
            if(err){
                return res.status(503).send({
                    msg : "Error. Couldn't connect to DB."
                })
            }

            if(!issetTopic){
                return res.status(404).send({
                    msg : "Error. Topic not exists." 
                });
            }

            return res.status(200).send({
                topic : issetTopic
            });
        });

    }, //close get controller

    update : function(req, res){
        //Pick up topic info
        var params = req.body;

        try{
            //Validate data
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        }catch(e){
            return res.status(400).send({
                msg: "Too few information."
            });
        }

        //GUARD CLAUSE
        if(!validate_title || !validate_content || !validate_lang){
            return res.status(400).send({
                msg: "Form's data isn't valid."
            });
        }else{
            //Search & update DB register
            //parms: condition, data to update, options, callback
            Topic.findOneAndUpdate({_id: req.params.idTopic}, params, {new:true}, (err, topicUpdated) => {
                if(err){
                    return res.status(500).send({
                        msg : "Error. Couldn't connect to DB."
                    });
                }
    
                if(topicUpdated){
                    //Verify topic owner
                    if(topicUpdated.user._id != req.user.sub){
                        return res.status(403).send({
                            msg : "Error. You can not update this topic."
                        });
                    }else {
                        return res.status(200).send({
                            msg : "Topic" + req.params.idTopic + " update succes!"
                        });
                    }
                    
                } else{
                    return res.status(404).send({
                        msg : "Error. Couldn't find topic in DB."
                    });
                }
            });
        }  
    }, //close update controller

    delete : function(req, res){
        Topic.findOne({
            _id: req.params.idTopic
        })
        .exec((err, issetTopic) => {
            if(err){
                return res.status(503).send({
                    msg : "Error. Couldn't connect to DB."
                })
            }

            if(!issetTopic){
                return res.status(404).send({
                    msg : "Error. Topic does not exists." 
                });

            }else{
                //Check topic owner
                if(issetTopic && (issetTopic.user._id == req.user.sub)){
                    Topic.findByIdAndDelete(req.params.idTopic, (err, removedTopic) => {
                        if(err){
                            return res.status(503).send({
                                msg : "Error. Couldn't connect to DB."
                            })
                        }
                        
                        else{
                            return res.status(200).send({
                                msg : "Topic delete success!"
                            });
                        }
                    });
                }else {
                    return res.status(403).send({
                        msg : "You can not delete this topic!"
                    });
                }
            }          
        });
    } //close delete controller
};

module.exports = controller;