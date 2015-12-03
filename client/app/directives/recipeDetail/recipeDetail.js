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
      console.log(recipeID);
      $scope.recipeID = recipeID;
      // Use Search Factory to get recipe details
      Search.getSingleRecipe(recipeID)
      	.then(function(recipe) {
          console.log(recipe.message);
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

  .controller('RecipeModalInstanceCtrl', ['$scope', '$uibModalInstance', '$http', 'ShoppingList', 'item', function($scope, $uibModalInstance, $http, ShoppingList, item) {
  	// Item injected as dependency and resolved from RecipeModalCtrl
    $scope.currentRecipe = item;
    console.log($scope.currentRecipe.RecipeID);
    $http({
          method: 'GET',
          url: '/api/recipes/nutrition/' + $scope.currentRecipe.RecipeID,
        })
        .then(function(data) {
          $scope.nutritionTotals = {};
          var nutrientStrings = ['Calories', 'Calories from fat', 'Total fat', 'Cholesterol', 'Sodium', 'Total carbohydrate', 'Protein'];
          for (var i = 0; i < nutrientStrings.length; i++) {
            $scope.nutritionTotals[nutrientStrings[i]] = 0;
            for (var j = 0; j < data.data.Ingredients.length; j++) {
              $scope.nutritionTotals[nutrientStrings[i]] += data.data.Ingredients[j].Nutrition[nutrientStrings[i]];
            }
            $scope.nutritionTotals[nutrientStrings[i]] = ~~$scope.nutritionTotals[nutrientStrings[i]];
          }
          console.log($scope.nutritionTotals);          
        });

    /**
     * Scales recipe up or down depending on servings
     */
    $scope.scaleRecipe = function(scaleFactor) {
      Scale.scaleRecipe(scaleFactor, item);
    };

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
