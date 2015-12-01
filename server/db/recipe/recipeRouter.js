var request = require('request');

module.exports = function(app) {

	// Search for a query string
  app.route('/search/:query')
    .get(function(req, res, next) {
      var query = "http://api.bigoven.com/recipes?any_kw=" + req.params.query + "&pg=1&rpp=100&api_key=8hUGXs4S34zTaDWaG1CMMmjfB9I3M944";
      var options = {
        url: query,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      request(options, function(err, response, data) {
        if (err) {
          console.log(err);
        }
        res.send(data);
      });
    });

  // Will find a single recipe by ID
  app.route('/:recipeId')
    .get(function(req, res, next) {
      var query = "http://api.bigoven.com/recipe/" + req.params.recipeId + "?api_key=8hUGXs4S34zTaDWaG1CMMmjfB9I3M944";
      var options = {
        url: query,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      request(options, function(err, response, data) {
        if (err) {
          console.log(err);
        }
        var parsed = JSON.parse(data);
        parsed.message = "yooooooooo";
        res.send(JSON.stringify(parsed));
      });
    });
};
