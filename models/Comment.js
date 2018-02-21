// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let CommentSchema = new Schema({
  author: String,
  content: String,
});

let Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
