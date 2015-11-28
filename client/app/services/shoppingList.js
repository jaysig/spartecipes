angular.module('ShoppingListFactory', [])
  .factory('ShoppingList', ['Ingredient', function(Ingredient) {

    /**
     * Initialize List Array
     * @type {Array}
     */
    var list = [];

    /**
     * Add a recipe to the list
     * @param {object} recipe [A recipe object in BigOven API format]
     */
    var addToList = function(recipe) {
      list.push(recipe);
    };

    /**
     * Returns the current list of recipes and ingredients
     * @return {[object]}
     */
    var getList = function() {
      return {
        recipes: list,
        ingredients: getIngredientList()
      };
    };

    /**
     * Combines all recipes' ingredients and uses
     * Ingredient Factory to combine them.
     * @return {[array]} [List of all recipes' ingredients combined and formatted]
     */
    var getIngredientList = function() {
      var ingredientList = list.reduce(function(memo, recipe) {
        return memo.concat(recipe.Ingredients);
      }, []);
      return Ingredient.formatIngredientList(ingredientList);
    };

    /**
     * Remove a recipe from the list
     * @param  {[int]} id [RecipeID to be removed]
     */
    var removeFromList = function(id) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].RecipeID === id) {
          list.splice(i, 1);
          console.log(list);
        }
      }
    };

    /**
     * Returns true if recipe is already in the list
     * @param  {[object]} recipe [Recipe object]
     * @return {[boolean]}
     */
    var recipeInList = function(recipe) {

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
      getIngredientList: getIngredientList,
      removeFromList: removeFromList,
      recipeInList: recipeInList
    };

  }]);
