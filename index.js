// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const logger = require('morgan');
const request = require('request');
const cheerio = require('cheerio');

// Initialize Express
const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(process.cwd() + '/public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Dtabase configuration
mongoose.connect('mongodb://localhost/scraper');

const db = mongoose.connection;

// Logs Mongoose errors
db.on('error', function(err) {
  console.log(`Mongoose Error: ${error}`);
});

db.once('open', function() {
  console.log('Connection Successful.');
});

let Comment = require('./models/Comment.js');
let Article = require('./models/Article.js');

// Import Routes and controller
const router = require('./controllers/controller.js');
app.use('/', router);

const PORT = process.env.PORT || 3007;

app.listen(PORT, function() {
  console.log(`Running on PORT: ${PORT}`);
});
