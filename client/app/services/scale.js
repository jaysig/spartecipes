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
        wholeNum = '';
      }

      if(!fraction ) {
        fraction = '';
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
     * Checks item display quantity to see if it's a range ie ["10-12"]
     * Assigns item.Quantity the highest # in the range
     * @param  {[object]} item [Ingredient from recipe]
     * 
     */
    var rangeQuantityImperial = function (item) {
      if(!!item.DisplayQuantity.match(/-/)) {
        var nums = item.DisplayQuantity.split("-");
        item.Quantity = nums[1];
      }
    };

    /**
     * Checks item metric display quantity to see if it's a range ie ["10-12"]
     * Assigns item.Quantity the highest # in the range
     * @param  {[object]} item [Ingredient from recipe]
     * 
     */
    var rangeQuantityMetric = function (item) {
      if(!!item.MetricDisplayQuantity.match(/-/)) {
        var nums = item.MetricDisplayQuantity.split("-");
        item.MetricQuantity = nums[1];
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
      console.log(ingredients);
      _.each(ingredients, function(item, i) {
        if(item.DisplayQuantity){
          if(item.DisplayQuantity.match(/-/)){
            rangeQuantityImperial(item);
            rangeQuantityMetric(item); 
          }
        } 

        scaledImperical.push(item.Quantity * (scaleFactor/servings));
        scaledMetric.push(item.MetricQuantity * (scaleFactor/servings));

        if(item.DisplayQuantity) {
          item.DisplayQuantity = formatAmount(scaledImperical[i]);
          item.MetricDisplayQuantity = scaledMetric[i].toString();
        }
      });
    };

  	return {
  		scaleRecipe: scaleRecipe,
  	};
  });