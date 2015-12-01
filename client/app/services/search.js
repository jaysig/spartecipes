/**
 * Recipe Search Factory
 * Routes to Big Oven API through server
 */
angular.module('SearchFactory', [])
  .factory('Search', function($http) {

    /**
     * Gets all recipes matching search criteria 
     * @param  {string} searchCriteria [recipe criteria]
     * @return {array}                 [array of matching recipes]
     */
    var getRecipes = function(searchCriteria) {
      return $http({
          method: 'GET',
          url: '/api/recipes/search/' + searchCriteria,
        })
        .then(function(data) {
          return data.data.Results;
        });
    };

    /**
     * Returns single recipe from ID
     * @param  {int} recipeID    [id for desired recipe]
     * @return {object}          [recipe object]
     */
    var getSingleRecipe = function(recipeID) {
      return $http({
          method: 'GET',
          url: '/api/recipes/' + recipeID,
        })
        .then(function(data) {
          return data.data;
        });
    };

    return {
      getRecipes: getRecipes,
      getSingleRecipe: getSingleRecipe
    };
  });
