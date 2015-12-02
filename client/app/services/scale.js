angular.module('ScaleFactory', [])
  .factory('Scale', function() {

    var formatAmount = function(amount) {
      var wholeNum = parseInt(amount.toString().match(/\d+/));
      var fraction = parseFloat(amount.toString().match(/\.\d+/));

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

    var scaleRecipe = function(scaleFactor, recipe) {
      var servings = recipe.YieldNumber;
      var ingredients = recipe.Ingredients;
  		var scaled = [];
      _.each(ingredients, function(item, i) {
        scaled.push(item.Quantity * (scaleFactor/servings));

        if(item.DisplayQuantity) {
          item.DisplayQuantity = formatAmount(scaled[i]);
        }
      });
    };

  	return {
  		scaleRecipe: scaleRecipe
  	};
  });