const path = require('path');

module.exports = function(app) {
  // index route loads index.html
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.get('/saved', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/saved.html'));
  });
};
