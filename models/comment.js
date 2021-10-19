const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    
    
    name: { type: String, require: true },
    Course: { type: String, require: true },
    PhoneNo: { type: String, require: true },
    comment: { type: String, require: true }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment