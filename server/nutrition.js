var keys = require('./keys');
var request = require('request');

module.exports.addNutrition = function(recipe, cb) {
  var ingredientStrings = '';
  for (var i = 0; i < recipe.Ingredients.length; i++) {
    ingredientStrings += (recipe.Ingredients[i].DisplayQuantity ? recipe.Ingredients[i].DisplayQuantity : '') + ' ' + (recipe.Ingredients[i].Unit ? recipe.Ingredients[i].Unit : '') + ' ' + (recipe.Ingredients[i].Name ? recipe.Ingredients[i].Name : '') + '\n';
  }
  console.log(ingredientStrings);
  //request.get({url: 'https://api.nutritionix.com/v1_1/search/cheddar%20cheese?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=1ae3df60&appKey=42826185c83bace9841af8a445309991'}, function(err, response, data) {
  var options = {
    url: 'https://api.nutritionix.com/v2/natural',
    headers: {
      'Content-Type': 'text/plain',
      'X-APP-ID': '1ae3df60',
      'X-APP-KEY': '42826185c83bace9841af8a445309991'
    },
    body: JSON.stringify(ingredientStrings)
  };
  request.post(options, function(err, response, data) {
    if (err) {
      console.log(response.errors);
    }
    console.log(response);
    console.log(data);
  });

  var calories = 0;
  for (i = 0; i < recipe.Ingredients.length; i++) {
    calories += 50;
  }
  recipe.message = calories;
  cb();
};