// Dependencies
const express = require('express');
const router = express.Router();
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

// Import Comment and Article models
let Comment = require('../models/Comment.js');
let Article = require('../models/Article.js');

router.get('/', function(req, res) {
  res.redirect('/scrape');
});

router.get('/articles', function(req, res) {
  Article.find()
    .sort({ id: -1 })
    .populate('comments')
    .exec((err, doc) => {
      if (err) throw err;
      let hbsObject = { articles: doc };
      res.render('index', hbsObject);
    });
});

router.get('/scrape', function(req, res) {
  console.log(
    '\n******************************************\n' +
      'Grabbing every article headline and link\n' +
      'from the NHL website:' +
      '\n******************************************\n'
  );
  request('https:www.nhl.com', function(err, res, html) {
    const $ = cheerio.load(html);
    let titlesArray = [];
    $('h4.headline-link').each((index, element) => {
      let result = [];
      result.title =
        $(element)
          .text()
          .trim() + '';
      result.link = $(element)
        .parent()
        .attr('href')
        .text()
        .trim();

      if (result.title !== '' && result.lik !== '') {
        if (titlesArray.indexOf(result.title) === -1) {
          titlesArray.push(result.title);
          Article.count({ title: result.title }, (err, test) => {
            if (test === 0) {
              let entry = new Article(result);
              entry.save((err, doc) => {
                if (err) throw err;
                console.log(doc);
              });
            } else {
              console.log('Duplicate content found. Aborting save to Database');
            }
          });
        } else {
          console.log('Ducplucate content found. Aborting save to Database.');
        }
      }
    });
    res.redirect('/articles');
  });
});

router.post('/add/comment/:id', function(req, res) {
  // Collects comments
  let articleID = req.params.id;
  let commentAuthor = req.body.name;
  let commentContent = req.body.comment;

  let result = {
    author: commentAuthor,
    content: commentContent,
  };
  let entry = new Comment(result);

  // Saves comment to database
  entry.save((err, doc) => {
    if (err) throw err;
    Article.findOneAndUpdate(
      { _id: articleID },
      { $push: { comments: doc._id } },
      { new: true }
    ).exec((err, doc) => {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});

// Delete a comment
router.post('/remove/comment/:id', function(req, res) {
  let commentID = req.params.id;
  Comment.findByIdAndRemove(commentID, (err, todo) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

module.exports = router;
