angular.module('ShoppingListFactory', [])
  .factory('ShoppingList', ['Ingredient', function(Ingredient) {

    var ingredientList = {};
    var displayList = {};

    var addToList = function(recipe) {
      list.push(recipe);
    };

    var getList = function() {
      var results = {
        recipes: list,
        ingredients: getIngredientList()
      };
      console.log(results);
      return results;
    };

    var getIngredientList = function() {
      var ingredientList = list.reduce(function(memo, recipe) {
        return memo.concat(recipe.Ingredients);
      }, []);
      return Ingredient.formatIngredientList(ingredientList);
    };

    var removeFromList = function(id) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].RecipeID === id) {
          list.splice(i, 1);
          console.log(list);
        }
      }
    };

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
