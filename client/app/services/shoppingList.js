angular.module('ShoppingListFactory', [])
  .factory('ShoppingList', function(Auth) {
    var list = [];
    var ingredientList = {};
    var displayList = {};

    var addFrac = function(frac1, frac2) {
      var finalTop;

      var gcd = function(a, b) {
        if (!b) {
          return a;
        }
        return gcd(b, a % b);
      };

      if (frac1.length > 2 && frac2.length > 2) {
        if (frac1[2] === frac2[2]) {
          newTop = Number(frac1[0]) + Number(frac2[0]);
          newBottom = Number(frac2[2]);
        } else {
          newTop = Number(frac1[0]) * Number(frac2[2]) + Number(frac2[0]) * Number(frac1[2]);
          newBottom = frac1[2] * frac2[2];
        }

        if (newTop === Number(newBottom)) {
          return 1;
        }

        var greatest = gcd(newTop, newBottom);
        finalTop = newTop / greatest;
        var finalBottom = newBottom / greatest;

        return finalTop + '/' + finalBottom;
      } else {
        finalTop = Number(frac1[2]) * frac2 + Number(frac1[0]);
        return finalTop + '/' + frac1[2];
      }


    };
    var addToList = function(recipe, cb) {
      if (Auth.isAuth) {
        list.push(recipe);
        cb(list);
      } else {
        console.error("You must be logged in to do that");
      }
    };

    var removeFromList = function(id) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].RecipeID === id) {
          list.splice(i, 1);
          orderIngredients(list);
        }
      }
    };

    var recipeInList = function(id) {
      console.log(id);
      for (var i = 0; i < list.length; i++) {
        if (list[i].RecipeID === id) {
          console.log("is in list");
          return true;
        }
      }
      console.log("not in list");
      return false;
    };

    var orderIngredients = function(list) {
      for (var key in ingredientList) {
        delete ingredientList[key];
      }

      for (var key2 in displayList) {
        delete displayList[key2];
      }

      for (var i = 0; i < list.length; i++) {
        var temp = list[i].Ingredients;
        for (var x = 0; x < temp.length; x++) {
          if (!ingredientList.hasOwnProperty(temp[x].Name)) {
            ingredientList[temp[x].Name] = [temp[x].DisplayQuantity, temp[x].Unit];
          } else {
            if (ingredientList[temp[x].Name][0][1] === "/") {
              ingredientList[temp[x].Name][0] = addFrac(ingredientList[temp[x].Name][0], temp[x].DisplayQuantity);
            } else if (temp[x].DisplayQuantity[1] === "/") {
              ingredientList[temp[x].Name][0] = addFrac(temp[x].DisplayQuantity, ingredientList[temp[x].Name][0]);
            } else {
              ingredientList[temp[x].Name][0] = Number(ingredientList[temp[x].Name][0]) + Number(temp[x].DisplayQuantity);
            }
          }
        }
      }

      for (var recipe in ingredientList) {
        var getUnit = ingredientList[recipe][1] ? ingredientList[recipe][1] : "";
        var getQuantity = ingredientList[recipe][0];
        var toNum1 = Number(getQuantity[0]);
        var toNum2 = Number(getQuantity[2]);

        //adding an s if necessary for plural amounts
        if (getQuantity > 1 || toNum1 / toNum2 > 1) {
          if (getUnit !== null && getUnit !== "") {
            if (getUnit[getUnit.length - 1] !== 's') {
              getUnit += 's';
            }
          }
        }
        //turning improper fraction into proper one
        if (toNum1 > toNum2) {
          var count = 0;
          while (toNum1 > toNum2) {
            toNum1 -= toNum2;
            count++;
          }
          displayList[recipe] = [count + " " + toNum1 + '/' + toNum2, getUnit];
        } else {
          displayList[recipe] = [ingredientList[recipe][0], getUnit];
        }
      }
    };

    return {
      recipeInList: recipeInList,
      displayList: displayList,
      list: list,
      removeFromList: removeFromList,
      addToList: addToList,
      ingredientList: ingredientList,
      orderIngredients: orderIngredients
    };

  });
