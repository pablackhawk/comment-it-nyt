//Dependencies
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');
const mongojs = require('mongojs');

const app = express();
const databaseUrl = 'scraper';
const collection = ['scrapeData'];

const db = mongojs(databaseUrl, collection);

const PORT = process.env.port || 3000;

module.exports = app => {
  db.on('error', error => {
    if (error) throw error;
  });

  app.get('/', (req, res) => {
    db.scrapeData.find({}),
      (error, data) => {
        if (error) throw error;
        res.json(data);
      };
  });

  app.get('/scrape', (req, res) => {
    let url = 'https://www.nytimes.com';
    request(url, (error, response, html) => {
      const $ = cheerio.load(html);
      $('h1.story-heading').each((index, element) => {
        let title = $(element).text();
        let link = $(element)
          .children('a')
          .attr('href');
        if (title && link) {
          db.scrapeData.insert(
            {
              title,
              link,
            },
            (err, inserted) => {
              if (err) throw err;
              console.log(inserted);
            }
          );
        }
      });
    });
    res.send('Scrape Complete');
  });

  app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
  });
};
