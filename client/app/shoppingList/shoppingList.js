angular.module('recipes')
  .controller('ShoppingListCtrl', ['$scope', '$rootScope', 'ShoppingList', function($scope, $rootScope, ShoppingList) {

    $scope.metric = false;

    /**
     * Initialize List Data
     */
    var getUserList = function(){
      $rootScope.search = false;
      var deferred = ShoppingList.getUserList();
      if (deferred) {
        deferred
          .then(function(list) {
            $scope.list = list;
          });
      } else {
        $scope.list = list;
      }
    };

    getUserList();

    /**
     * Remove a recipe from the list and refreshes scope list with
     * recipes and ingredients
     * @param  {int} id [id of the recipe to remove]
     */
    $scope.removeItem = function(id) {
      ShoppingList.removeFromList(id);
      $scope.list = ShoppingList.getList();     
    };

    /**
     * Clears all the reciepes from the list
     */
      $scope.clearList = function() {
      ShoppingList.resetList();
      getUserList();
    };
  }]);