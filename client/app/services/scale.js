angular.module('ScaleFactory', [])
  .factory('Scale', function () {

    /**
     * Format scaled ingredient display quantity to show fractions for imperical
     * @param {int} quantity [scaled Ingredient.Quantity]
     */
    var formatAmount = function (quantity) {
      var wholeNum = parseInt(quantity.toString().match(/\d+/));
      var fraction = parseFloat(quantity.toString().match(/\.\d+/));

      if(!wholeNum) {
        wholeNum = null;
      }

      if(!fraction ) {
        fraction = null;
      } else {
        fraction = math.fraction(fraction);
      }

      if(wholeNum && fraction) {
        return wholeNum.toString() + " " + fraction.toFraction().toString();  
      } else if(wholeNum && !fraction) {
        return wholeNum.toString();
      } else if(!wholeNum && fraction) {
        return fraction.toFraction().toString();
      }

    };

    /**
     * Scale recipe as a proportion of recipe's YieldNumber (servings),
     * only changes display amount not actual ingredient quantity
     * need to use DisplayQuantity to get the right quantities to add to shopping list
     * @param {int} scaleFactor [user-defined number of servings]
     * @param {object} recipe [currently selected recipe]
     */    
    var scaleRecipe = function (scaleFactor, recipe) {
      var servings = recipe.YieldNumber;
      var ingredients = recipe.Ingredients;
      var scaledImperical = [];
      var scaledMetric = [];
      _.each(ingredients, function(item, i) {
        scaledImperical.push(item.Quantity * (scaleFactor/servings));
        scaledMetric.push(item.MetricQuantity * (scaleFactor/servings));

        if(item.DisplayQuantity) {
          item.DisplayQuantity = formatAmount(scaledImperical[i]);
          item.MetricDisplayQuantity = scaledMetric[i];
          }
      });
    };

  	return {
  		scaleRecipe: scaleRecipe,
  	};

  });