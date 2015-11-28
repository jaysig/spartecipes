angular.module('recipes')
  .directive('recipeDetailModal', [function() {
    return {
      restrict: 'EA',
      controller: 'RecipeModalCtrl',
      scope: {
        recipe: '='
      },
      link: function(scope, el, attr) {
      	/**
      	 * When the directive's element is clicked, it will open up a modal
      	 * window, passing in the current recipe's ID.
      	 */
        el.on('click', function() {
          scope.openModal(scope.recipe.RecipeID);
        });
      }
    };
  }])
  .controller('RecipeModalCtrl', ['$scope', '$uibModal', 'Search', function($scope, $uibModal, Search) {

  	/**
  	 * Get recipe details and open a modal instance to display details
  	 * @param  {number} recipeID [ID for recipe]
  	 */
    $scope.openModal = function(recipeID) {
      // Use Search Factory to get recipe details
      Search.getSingleRecipe(recipeID)
      	.then(function(recipe) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/app/directives/recipeDetail/recipeDetail.html',
          controller: 'RecipeModalInstanceCtrl',
          // Passes recipe details to modal instance
          resolve: {
            item: function() {
              return recipe;
            }
          }
        });
      });
    };

  }])
  .controller('RecipeModalInstanceCtrl', ['$scope', '$uibModalInstance', 'ShoppingList', 'item', function($scope, $uibModalInstance, ShoppingList, item) {
  	// Item injected as dependency and resolved from RecipeModalCtrl
    $scope.currentRecipe = item;

    /**
     * Closes modal window
     */
    $scope.close = function() {
      $uibModalInstance.close();
    };

    /**
     * Adds recipe detail to ShoppingList factory and closes modal window
     */
    $scope.addToList = function() {
      $uibModalInstance.close();
      ShoppingList.addToList(item);
    };
  }]);
