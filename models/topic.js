'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2'); //Link paginate to mongoose
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

//Add methods from paginate to mongoose
TopicSchema.plugin(mongoosePaginate);


var Comment = mongoose.model('Comment', CommentSchema);
var Topic = mongoose.model('Topic', TopicSchema);

module.exports = {
    Comment,
    Topic
}

