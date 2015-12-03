var keys = require('./keys');
var request = require('request');
var math = require('mathjs');

var prepareNumber = function(str) {
  return math.sum(str.split(' ').map(function(a) {return eval(a)}));
}

module.exports.addNutrition = function(recipe, cb) {
  var process = function(ingredient, err, response, data) {
    console.log('processing');
    ingredient.Nutrition = {};
      var ingredientResult = JSON.parse(data).hits[0];
      console.log(JSON.parse(data).hits[0]);
      console.log(prepareNumber(ingredient.DisplayQuantity));
      try {
      var recipeUnit = math.unit(prepareNumber(ingredient.DisplayQuantity), ingredient.Unit);
      var nutritionUnit = math.unit(ingredientResult.fields.nf_serving_size_qty, ingredientResult.fields.nf_serving_size_unit);
      console.log(recipeUnit.toString());
      console.log(nutritionUnit.toString());
      var multiplier = recipeUnit.toNumber(ingredientResult.fields.nf_serving_size_unit) / nutritionUnit.toNumber(ingredientResult.fields.nf_serving_size_unit);
      ingredient.Nutrition.calories = ingredientResult.fields.nf_calories * multiplier;
      console.log('Multiplier: ' + multiplier);
      } catch (e) {
        console.log('Unknown unit ' + ingredient.Unit + ' or ' + ingredientResult.fields.nf_serving_size_unit);
        ingredient.Nutrition.calories = 0;
      }
      console.log('Total calories for ingredient: ' + ingredient.Nutrition.calories);

      for (var i = 0; i < recipe.Ingredients.length; i++) {
        if (!recipe.Ingredients[i].hasOwnProperty('Nutrition')) {
          return;
        } else if (i === recipe.Ingredients.length - 1) {
          cb();
        }
      }
  }  
  for (var i = 0; i < recipe.Ingredients.length; i++) {
    console.log(recipe.Ingredients[i].Name);
    console.log(encodeURIComponent(recipe.Ingredients[i].Name));
    var url = 'https://api.nutritionix.com/v1_1/search/' + encodeURIComponent(recipe.Ingredients[i].Name) + '?fields=item_name%2Cnf_calories%2Cnf_total_fat%2Cnf_serving_size_unit%2Cnf_serving_size_qty&appId=1ae3df60&appKey=42826185c83bace9841af8a445309991';
    request.get({url: url}, process.bind(null, recipe.Ingredients[i]));
  }
};