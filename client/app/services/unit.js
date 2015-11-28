angular.module('IngredientFactory', [])
  .factory('Ingredient', [function() {

    var conversionList = {
      'pound': 'lbs',
      'pounds': 'lbs'
    };

    /**
     * Combines same ingredients together, adds quantities, and returns formatted array
     * @param  {[array]} list [list of all ingredients]
     * @return {[array]}      [formatted and combined array]
     */
    var formatIngredientList = function(list){
      var orderedList = orderIngredients(list);
      orderedList = _.map(orderedList, function(ingredient){
        ingredient.quantity = addUnits(ingredient.quantity);
        return ingredient;
      });
      return zip(orderedList);
    };

    /**
     * Converts object into an array
     * Adds each property as an element
     * @param  {[object]} list [object]
     * @return {[array]}       
     */
    var zip = function(list){
      var results = [];
      for(var prop in list){
        results.push(list[prop]);
      }
      return results;
    };  

    /**
     * Combines ingredients with the same IngredientID
     * Preserves name and adds quantity info to quantity property
     * @param  {[array]} ingredientList [Array of all ingredients]
     * @return {[objet]}                [Object with keys of IngredientID]
     */
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

    /**
     * Sums and formats an array of quantities
     * Makes use of mathjs to add and convert units
     * @param {[array]} ingredients
     */
    var addUnits = function(ingredients) {

      return ingredients.reduce(function(list, item) {

        var unitObj = toUnit(item.Quantity, item.Unit);

        // if item is a recognized unit
        if (unitObj) {
          // initialize new list obj
          if (!list.sumUnit) {
            list.sumUnit = unitObj;
          } else {
            // add the item to the sum
            list.sumUnit = math.add(list.sumUnit, unitObj);
          }

          // parse out a string
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

    /**
     * Converts to mathjs library unit object
     * Returns false if not a valid mathjs unit
     * @param  {[int]} quantity   
     * @param  {[string]} unit     [name of unit]
     * @return {[boolean/object]}  [returns mathjs unit or false if not valid]
     */
    var toUnit = function(quantity, unit) {

      unit = unitConversion(unit);

      try {
        // Recognized unit
        return math.unit(quantity, unit);
      } catch (e) {
        // Unrecognized unit
        return false;
      }
    };

    /**
     * Converts unit types to mathjs strings if unit requires an alias
     * @param  {[string]} unitName [current unit name]
     * @return {[string]}          [unit name or alias]
     */
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
