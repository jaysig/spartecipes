angular.module('IngredientFactory', [])
  .factory('Ingredient', [function () {
    var conversionList = {
      'pound': 'lbs',
      'pounds': 'lbs'
    };

    /**
     * Combines same ingredients together, adds quantities, and returns formatted array
     * @param  {[array]} list [list of all ingredients]
     * @return {[array]}      [formatted and combined array]
     */
    var formatIngredientList = function (list) {
      var orderedList = orderIngredients(list);
      orderedList = _.map(orderedList, function (ingredient) {
        ingredient.quantity = addUnits(ingredient.quantity, false);
        ingredient.metricQuantity = addUnits(ingredient.metricQuantity, true);
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
    var zip = function (list) {
      var results = [];
      for (var prop in list) {
        results.push(list[prop]);
      }
      return results;
    };

    /**
     * Checks item display quantity to see if it's a range ie ["10-12"]
     * @param  {[object]} item [Ingredient from recipe]
     * @return {[int]}  quantity [parsed highest ingredient quantity]
     */
    var rangeQuantityImperial = function (item) {
      if(!!item.DisplayQuantity.match(/-/)) {
        var nums = item.DisplayQuantity.split("-");
        return parseInt(Math.round(nums[1]));
      }
    };

    /**
     * Retrieves the ingredient quantity from ingredient.DisplayQuantity
     * @param  {[object]} item [Ingredient from recipe]
     * @return {[int]}  quantity [parsed ingredient quantity]
     */
    var getQuantityImperial = function (item) {
      var num, decimal, quantity;

      if(item.DisplayQuantity === null) {
        item.DisplayQuantity = '';
        return item.DisplayQuantity;
      }

      var w = item.DisplayQuantity.match(/\d+/);
      var f = item.DisplayQuantity.match(/\d+\/\d+/);

      if(f === null){
        return rangeQuantityImperial(item);        
      }

      if(item.DisplayQuantity.length === 5) {
        num = parseInt(w[0]);
        decimal = math.fraction(f[0]);
        quantity = num + decimal.n/decimal.d;
        
      } else if (item.DisplayQuantity.length === 3) {
        decimal = math.fraction(f[0]);
        quantity = decimal.n/decimal.d;

      } else if (item.DisplayQuantity.length === 1) {
        num = parseInt(w[0]);
        quantity = num;
      }

      return quantity;
    };


    /**
     * Retrieves the ingredient quantity from ingredient.MetricDisplayQuantity
     * @param  {[object]} item [Ingredient from recipe]
     * @return {[int]}  quantity [parsed ingredient quantity]
     */
    var getQuantityMetric = function (item) {
      var quantity;
      if(item.MetricDisplayQuantity === null) {
        item.MetricDisplayQuantity = '';
        return item.MetricDisplayQuantity;
      }

      if(!!item.MetricDisplayQuantity.match(/-/)) {
        var nums = item.MetricDisplayQuantity.split("-");
        return parseInt(Math.round(nums[1]));
      }

      quantity = parseFloat(item.MetricDisplayQuantity);
      return quantity;
    };

    /**
     * Combines ingredients with the same IngredientID
     * Preserves name and adds quantity info to quantity property
     * @param  {[array]} ingredientList [Array of all ingredients]
     * @return {[objet]}                [Object with keys of IngredientID]
     */
    var orderIngredients = function (ingredientList) {
      return ingredientList.reduce(function (list, ingredient) {
        if (!list[ingredient.IngredientID]) {
          list[ingredient.IngredientID] = {
            Name: ingredient.Name,
            quantity: [],
            metricQuantity: []
          };
        }

        list[ingredient.IngredientID].quantity.push({
          Quantity: getQuantityImperial(ingredient),
          DisplayQuantity: ingredient.DisplayQuantity,
          Unit: ingredient.Unit
        });
        list[ingredient.IngredientID].metricQuantity.push({
          MetricQuantity: getQuantityMetric(ingredient),
          MetricDisplayQuantity: ingredient.MetricDisplayQuantity,
          MetricUnit: ingredient.MetricUnit
        });

        return list;
      }, {});
    };


    /**
     * Sums and formats an array of quantities
     * Makes use of mathjs to add and convert units
     * @param {[array]} ingredients
     */
    var addUnits = function (ingredients, metric) {
      return ingredients.reduce(function (list, item) {
        var unitObj;

        if (!metric) {
          unitObj = toUnit(getQuantityImperial(item), item.Unit);
        } else {
          unitObj = toUnit(getQuantityMetric(item), item.MetricUnit);
        }

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
          var precision = metric ? 3 : 2;
          list.sumString = list.sumUnit.format(precision);
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
    var toUnit = function (quantity, unit) {
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
    var unitConversion = function (unitName) {
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
