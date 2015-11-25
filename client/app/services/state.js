angular.module('StateFactory', [])
  .factory('State', function($stateProvider, $scope) {
    $scope.changeState = function(state) {
      $state.go(state);
    };
  });
