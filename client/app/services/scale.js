angular.module('ScaleFactory', [])
  .factory('Scale', ['Search', function (Search) {
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
     * @param {int} scaleFactor [user-defined number of servings]
     * @param {object} recipe [currently selected recipe]
     */    

    var scaleRecipe = function (scaleFactor, recipe) {
      var servings = recipe.YieldNumber;
      var ingredients = recipe.Ingredients;
      var scaledImperical = [];
      var scaledMetric = [];
      _.each(ingredients, function(item, i) {
        //scaledImperical.push(item.Quantity * (scaleFactor/servings));
        //scaledMetric.push(item.MetricQuantity * (scaleFactor/servings));

        item.Quantity = item.Quantity * (scaleFactor/servings);
        item.MetricQuantity = item.MetricQuantity * (scaleFactor/servings);


        if(item.DisplayQuantity) {
          item.DisplayQuantity = formatAmount(item.Quantity);
          item.MetricDisplayQuantity = item.MetricQuantity;
        }
      });
      console.log(ingredients);
    };

    /**
     * Scales the recipe and changes the quantities once the user 
     * has decided on serving size
     * @param {int} scaleFactor [user-defined number of servings]
     * @param {object} recipe [currently selected recipe]
     */  

     // var restoreOriginalQuantity = function (recipe, ) {
     //   Search.getSingleRecipe(recipe.RecipeID)
     //   .then(function(recipe) {
     //    var ingredients = recipe.Ingredients;
     //      _.each(ingredients, function(item) {
     //        item.Quantity
     //      })
     //   })
     // }


  	return {
  		scaleRecipe: scaleRecipe,
  	};

  }]);