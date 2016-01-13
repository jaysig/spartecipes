angular.module('recipes')
  .controller('MainCtrl', ['$scope', '$rootScope', '$log', '$state', function($scope, $rootScope, $log, $state) {
    $rootScope.search = true;
    /**
     * Listen for a search event
     * On search, change to recipe state and pass the search query as a paramter
     */
    $rootScope.$on('search', function(e, query){
    	$log.warn(query + ' this is being searched');
    	$state.go('recipe', {'query': query});
    });
  }]);
