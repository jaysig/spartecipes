angular.module('recipes')
  .controller('ShoppingListCtrl', ['$scope', 'ShoppingList', function($scope, ShoppingList) {

  	$scope.list = ShoppingList.getList();

    $scope.removeItem = function(id) {
      ShoppingList.removeFromList(id);
      $scope.list = ShoppingList.getList();
    };
  }]);
