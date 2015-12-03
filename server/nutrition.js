var keys = require('./keys');
var request = require('request');
var math = require('mathjs');

var nutrientStrings = ['Calories', 'Calories from fat', 'Total fat', 'Cholesterol', 'Sodium', 'Total carbohydrate', 'Protein'];

var prepareNumber = function(str) {
  return math.sum(str.split(' ').map(function(a) {
    return eval(a)
  }));
}

module.exports.addNutrition = function(recipe, cb) {
  var process = function(ingredient, err, response, data) {
    ingredient.Nutrition = {};
    var ingredientResult = JSON.parse(data).hits[0];
    try {
      var recipeUnit = math.unit(prepareNumber(ingredient.DisplayQuantity), ingredient.Unit);
      var nutritionUnit = math.unit(ingredientResult.fields.nf_serving_size_qty, ingredientResult.fields.nf_serving_size_unit);
      console.log(recipeUnit.toString());
      console.log(nutritionUnit.toString());
      var multiplier = recipeUnit.toNumber(ingredientResult.fields.nf_serving_size_unit) / nutritionUnit.toNumber(ingredientResult.fields.nf_serving_size_unit);
      ingredient.Nutrition['Calories'] = ingredientResult.fields.nf_calories * multiplier;
      ingredient.Nutrition['Calories from fat'] = ingredientResult.fields.nf_calories_from_fat * multiplier;
      ingredient.Nutrition['Total fat'] = ingredientResult.fields.nf_total_fat * multiplier;
      ingredient.Nutrition['Cholesterol'] = ingredientResult.fields.nf_cholesterol * multiplier;
      ingredient.Nutrition['Sodium'] = ingredientResult.fields.nf_sodium * multiplier;
      ingredient.Nutrition['Total carbohydrate'] = ingredientResult.fields.nf_total_carbohydrate * multiplier;
      ingredient.Nutrition['Protein'] = ingredientResult.fields.nf_protein * multiplier;
    } catch (e) {
      console.log('Unknown unit ' + ingredient.Unit + ' or ' + ingredientResult.fields.nf_serving_size_unit);
      ingredient.Nutrition['Calories'] = 0;
      ingredient.Nutrition['Calories from fat'] = 0;
      ingredient.Nutrition['Total fat'] = 0;
      ingredient.Nutrition['Cholesterol'] = 0;
      ingredient.Nutrition['Sodium'] = 0;
      ingredient.Nutrition['Total carbohydrate'] = 0;
      ingredient.Nutrition['Protein'] = 0;
    }

    for (var i = 0; i < recipe.Ingredients.length; i++) {
      if (!recipe.Ingredients[i].hasOwnProperty('Nutrition')) {
        return;
      } else if (i === recipe.Ingredients.length - 1) {
        cb();
      }
    }
  }
  for (var i = 0; i < recipe.Ingredients.length; i++) {
    var url = 'https://api.nutritionix.com/v1_1/search/' + encodeURIComponent(recipe.Ingredients[i].Name) + '?fields=item_name%2Cnf_calories%2Cnf_total_fat%2Cnf_calories_from_fat%2Cnf_cholesterol%2Cnf_sodium%2Cnf_total_carbohydrate%2Cnf_protein%2Cnf_serving_size_unit%2Cnf_serving_size_qty&appId=' + keys.NUTRITIONIX_APP_ID + '&appKey=' + keys.NUTRITIONIX_APP_KEY;
    request.get({
      url: url
    }, process.bind(null, recipe.Ingredients[i]));
  }
};
