angular.module('recipes')
  .controller('ShoppingListCtrl', ['$scope', 'ShoppingList', function($scope, ShoppingList) {

  	/**
  	 * Initialize List Data
  	 */
  	$scope.list = ShoppingList.getList();

  	/**
  	 * Remove a recipe from the list and refreshes scope list with
  	 * recipes and ingredients
  	 * @param  {int} id [id of the recipe to remove]
  	 */
    $scope.removeItem = function(id) {
      ShoppingList.removeFromList(id);
      $scope.list = ShoppingList.getList();
    };
  }]);
