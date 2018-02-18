//Dependencies
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const mongojs = require('mongojs');
const app = express();
const databaseUrl = 'scraper';
const collection = ['scrapeData'];

const db = mongojs(databaseUrl, collection);
const PORT = process.env.port || 3007;

db.on('error', err => {
  if (err) throw err;
});

app.get('/', (req, res) => {
  res.send('Hello Hockey Fans!');
});

app.get('/all', (req, res) => {
  db.scrapeData.find({}, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

app.get('/scrape', (req, res) => {
  console.log(
    '\n******************************************\n' +
      'Grabbing every article headline and link\n' +
      'from the NHL website:' +
      '\n******************************************\n'
  );
  request('https://www.nhl.com', (err, res, html) => {
    // Loads HTML body into cheerio
    const $ = cheerio.load(html);
    // Array for scraped data
    let results = [];
    // Searches for headlines
    $('h4.headline-link').each((index, element) => {
      let title = $(element).text();
      let link = $(element)
        .parent()
        .attr('href');
      // Pushes data into database
      if (title && link) {
        db.scrapeData.insert(
          {
            title: title,
            link: link,
          },
          { unique: true },
          (err, inserted) => {
            if (err) throw err;
            console.log(inserted);
          }
        );
      }
    });
  });
  res.send('Scrape Completed');
});

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
