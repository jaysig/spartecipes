angular.module('ShoppingListFactory', [])
  .factory('ShoppingList', ['Ingredient', 'User', function (Ingredient, User) {

    /**
     * Initialize List Array
     * @type {Array}
     */
    var list = [];

    var getList = function () {
      return {
        recipes: list,
        ingredients: getIngredientList()
      };
    };

    /**
     * Add a recipe to the list
     * @param {object} recipe [A recipe object in BigOven API format]
     */
    var addToList = function (recipe) {
      var toTitleCase = function (str) {
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };

      recipe.Ingredients.map(function (ingredient) {
        ingredient.Name = toTitleCase(ingredient.Name.toLowerCase());

        // Seems as though some ingredients with matching names have different IDs
        // Override ID to make ingredients match for volume unit work
        list.map(function (recipe) {
          recipe.Ingredients.map(function (thisIngredient) {
            if (ingredient.Name === thisIngredient.Name) {
              ingredient.IngredientID = thisIngredient.IngredientID;
            }
          });
        });
      });

      list.push(recipe);
      User.updateUserList(list);
    };

    /**
     * Returns the current list of recipes and ingredients
     * @return {[object]}
     */
    var getUserList = function () {
      var deferred = User.getUserList();
      if (deferred) {
        return deferred
          .then(function (userList) {
            if (userList) {
              list = userList;
            }
            return {
              recipes: list,
              ingredients: getIngredientList()
            };
          });
      } else {
        return {
          then: function () {
            return {
              recipes: list,
              ingredients: getIngredientList()
            };
          }
        };
      }
    };

    /**
     * Combines all recipes' ingredients and uses
     * Ingredient Factory to combine them.
     * @return {[array]} [List of all recipes' ingredients combined and formatted]
     */
    var getIngredientList = function () {
      var ingredientList = list.reduce(function (memo, recipe) {
        return memo.concat(recipe.Ingredients);
      }, []);
      return Ingredient.formatIngredientList(ingredientList);
    };

    /**
     * Remove a recipe from the list
     * @param  {[int]} id [RecipeID to be removed]
     */
    var removeFromList = function (id) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].RecipeID === id) {
          list.splice(i, 1);
          User.updateUserList(list);
        }
      }
    };

    /**
     * Returns true if recipe is already in the list
     * @param  {[object]} recipe [Recipe object]
     * @return {[boolean]}
     */
    var recipeInList = function (recipe) {

      for (var i = 0; i < list.length; i++) {
        if (list[i].RecipeID === recipe.RecipeID) {
          return true;
        }
      }
      return false;
    };

    return {
      addToList: addToList,
      getList: getList,
      getUserList: getUserList,
      getIngredientList: getIngredientList,
      removeFromList: removeFromList,
      recipeInList: recipeInList
    };

  }]);
