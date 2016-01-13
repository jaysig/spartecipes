angular.module('recipes')
	.controller('RecipeCtrl', ['$scope', '$rootScope', '$stateParams', 'Search', function($scope, $rootScope, $stateParams, Search){

		$scope.recipes = [];

		/**
		 * Find recipes matching a search query set to $scope.recipes
		 * @param  {[string]} query [search query]
		 */
		var searchRecipes = function(query){
			Search.getRecipes(query)
				.then(function(results){
					$scope.recipes = results;
				});
		};

		/**
		 * Initializes recipe results using the $stateParams query parameter
		 * Used when moving here from another state
		 */
		if($stateParams.query){
			searchRecipes($stateParams.query);
		}

		/**
		 * Listen for new searches and display results
		 */
		$rootScope.$on('search', function(e, query){
			searchRecipes(query);
		});

	}]);