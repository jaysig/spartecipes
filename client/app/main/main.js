angular.module('recipes')
  .controller('MainCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
    /**
     * Listen for a search event
     * On search, change to recipe state and pass the search query as a paramter
     */
    $rootScope.$on('search', function(e, query){
    	$state.go('recipe', {'query': query});
    });
  }]);
