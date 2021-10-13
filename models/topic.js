'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
    content : String,
    date : {type: Date, default: Date.now},
    user : {type: Schema.ObjectId, ref: 'User'}
});

var TopicSchema = Schema({
    title : String,
    content : String,
    code : String,
    lang : String,
    date : {type: Date, default: Date.now},
    user : {type: Schema.ObjectId, ref: 'User'},
    comments: [CommentSchema]
});

module.exports = mongoose.model('Topic', TopicSchema);