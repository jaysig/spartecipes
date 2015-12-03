angular.module('NutritionFactory', [])
  .factory('Nutrition', function($http) {
    var getNutrition = function(recipeID) {
      return $http({
          method: 'GET',
          url: '/api/recipes/nutrition/' + recipeID,
        })
        .then(function(data) {
          data.data.nutritionTotals = {};
          data.data.nutritionComplete = true;
          var nutrientStrings = ['Calories', 'Calories from fat', 'Total fat', 'Cholesterol', 'Sodium', 'Total carbohydrate', 'Protein'];
          for (var i = 0; i < nutrientStrings.length; i++) {
            data.data.nutritionTotals[nutrientStrings[i]] = 0;
            for (var j = 0; j < data.data.Ingredients.length; j++) {
              data.data.nutritionTotals[nutrientStrings[i]] += data.data.Ingredients[j].Nutrition[nutrientStrings[i]];
              if (!data.data.Ingredients[j].Nutrition.complete) {
                data.data.nutritionComplete = false;
              }
            }
            data.data.nutritionTotals[nutrientStrings[i]] = ~~data.data.nutritionTotals[nutrientStrings[i]];
          }
          return data.data;          
        });

    };

    return {
      getNutrition: getNutrition
    };
  });