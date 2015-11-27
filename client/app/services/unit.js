angular.module('IngredientFactory', [])
  .factory('Ingredient', [function() {

    var conversionList = {
      'pound': 'lbs',
      'pounds': 'lbs'
    };

    var formatIngredientList = function(list){
      var orderedList = orderIngredients(list);
      console.log(orderedList);
      orderedList = _.map(orderedList, function(ingredient){
        ingredient.quantity = addUnits(ingredient.quantity);
        return ingredient;
      });
      return zip(orderedList);
    };

    var zip = function(list){
      var results = [];
      for(var prop in list){
        results.push(list[prop]);
      }
      return results;
    };  

    var orderIngredients = function(ingredientList) {
      return ingredientList.reduce(function(list, ingredient) {
        if (!list[ingredient.IngredientID]) {
          list[ingredient.IngredientID] = {
            Name: ingredient.Name,
            quantity: []
          };
        }
        list[ingredient.IngredientID].quantity.push({
          Quantity: ingredient.Quantity,
          DisplayQuantity: ingredient.DisplayQuantity,
          Unit: ingredient.Unit
        });
        return list;
      }, {});
    };

    var addUnits = function(ingredients) {

      return ingredients.reduce(function(list, item) {

        var unitObj = toUnit(item.Quantity, item.Unit);

        if (unitObj) {
          if (!list.sumUnit) {
            list.sumUnit = unitObj;
          } else {
            list.sumUnit = math.add(list.sumUnit, unitObj);
          }

          list.sumString = list.sumUnit.format(2);
          list.parsed.push(item);
        } else {
          list.unparsed.push(item);
        }

        return list;
      }, {
        sumString: '',
        sumUnit: null,
        parsed: [],
        unparsed: []
      });
    };

    var toUnit = function(quantity, unit) {

      unit = unitConversion(unit);

      try {
        return math.unit(quantity, unit);
      } catch (e) {
        return false;
      }
    };

    var unitConversion = function(unitName) {
      if (conversionList[unitName]) {
        return conversionList[unitName];
      } else {
        return unitName;
      }
    };

    return {
      formatIngredientList: formatIngredientList
    };
  }]);
