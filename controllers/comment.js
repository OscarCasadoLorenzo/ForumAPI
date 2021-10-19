'use strict'

var controller = {
    save : function(req, res){
        return res.status(200).send({
            msg : "Save de comment controller"
        });

    }, //close save controller

    update : function(req, res){
        return res.status(200).send({
            msg : "Update de comment controller"
        });
    }, //close update controller

    delete : function(req, res){
        return res.status(200).send({
            msg : "Delete de comment controller"
        });
    } //close delete controller
}

module.exports = controller;