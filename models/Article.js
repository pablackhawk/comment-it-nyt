// Dependencies
const moment = require('moment');
const mongoose = require('mongoose');

// Create Schema class
const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Article needed'],
    unique: true,
  },
  link: {
    type: String,
    required: true,
  },
  updated: {
    type: String,
    default: moment().format('MMM Do YYY, h:mm A'),
  },
  // Creates relation with Comment model
  comments: [
    {
      type: Schema.Types.ObjectID,
      ref: 'Comment',
    },
  ],
});

// Creates the Article model
let Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
