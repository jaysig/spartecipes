angular.module('ShoppingListFactory', [])
  .factory('ShoppingList', function(Auth) {
    var list = [];
    var ingredientList = {};
    var displayList = {};

    var addToList = function(recipe) {
      list.push(recipe);
      console.log(getList());
    };

    var getList = function(){
      return list;
    };

    var getIngredientList = function(){
      return list.map(function(recipe){
        return recipe.Ingredients;
      });
    };

    var removeFromList = function(id) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].RecipeID === id) {
          list.splice(i, 1);
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
      getList : getList,
      getIngredientList: getIngredientList,
      removeFromList: removeFromList,
      recipeInList: recipeInList
    };

  });
