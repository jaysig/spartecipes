angular.module('recipes.recipes', [])

.controller('HeaderController', function($scope, $rootScope, Search, $uibModal, ShoppingList, Auth) {

  // Your code here
  $scope.data = {};
  $scope.isAuth = Auth.isAuth();
  angular.extend($scope, Search, ShoppingList);

  $scope.$on('userAction', function() {
    $scope.isAuth = Auth.isAuth();
  });

  $scope.updateList = function() {
    ShoppingList.orderIngredients(function(newList) {
      $scope.data.ingredients = newList;
    });
  };

  $rootScope.$on('search', function(e, search) {
    $scope.retrieveRecipes(search);
  });

  $scope.retrieveRecipes = function(data) {
    Search.getRecipes(data)
      .then(function(recipes) {
        $scope.data.recipes = recipes;
      });
  };


  $scope.open = function(recipeID) {
    Search.getSingleRecipe(recipeID).then(function(recipe) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'app/recipes/RecipeContent.html',
        controller: 'RecipeInstanceCtrl',
        resolve: {
          item: function() {
            return recipe;
          }
        }
      });
    });
  };
})

.controller('RecipeInstanceCtrl', function($scope, $uibModalInstance, Auth, Search, item, ShoppingList) {

  angular.extend($scope, Search);
  $scope.currentRecipe = item;
  $scope.isAuth = Auth.isAuth();

  $scope.$on('userAction', function() {
    $scope.isAuth = Auth.isAuth();
  });

  $scope.no = function() {
    $uibModalInstance.close();
  };

  $scope.ok = function() {
    $uibModalInstance.close();
    ShoppingList.addToList(item);
  };
});
