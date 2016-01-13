angular.module('recipes.login', [])
  .directive('login', [function() {
    return {
      restrict: 'EA',
      template: '<a ng-hide="isLoggedIn" href="#" ng-click="openLogin()">Login</a>',
      controller: 'LoginDirectiveCtrl'
    };
  }])
  .directive('logout', [function() {
    return {
      restrict: 'EA',
      template: '<a ng-show="isLoggedIn" href="#" ng-click="logout()">Logout</a>',
      controller: 'LoginDirectiveCtrl'
    };
  }])
  .controller('LoginDirectiveCtrl', ['$scope', '$rootScope', '$uibModal', 'Auth', function($scope, $rootScope, $uibModal, Auth) {

    $scope.isLoggedIn = (Auth.isAuth()) ? true : false;

    $rootScope.$on('userAction', function(){
      $scope.isLoggedIn = (Auth.isAuth()) ? true : false;
    });

    $scope.openLogin = function() {
      $rootScope.search = false;
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'app/directives/login/login.html',
        controller: 'LoginInstanceCtrl',
      });
    };

    $scope.logout = function() {
      Auth.logout();
      $rootScope.$broadcast('userAction');
    };



  }])
  .controller('LoginInstanceCtrl', ['$scope', '$rootScope', '$uibModalInstance', '$window', 'Auth', function($scope, $rootScope, $uibModalInstance, $window, Auth) {

    $scope.user = {};
    $scope.showLogin = true;

    $scope.toggleLogin = function() {
      $scope.showLogin = !($scope.showLogin);
    };

    $scope.close = function() {
      $uibModalInstance.close();
      $rootScope.search = true;
    };

    $scope.login = function() {
      Auth.login($scope.user)
        .then(function(resp) {
          if (resp.data.token) {
            $window.localStorage.setItem('spartanShield', resp.data.token);
            $rootScope.$broadcast('userAction');
            $scope.close();
          } else {
            if (resp.data.err) {
              $scope.message = resp.data.err;
            }
          }
        });
    };

    $scope.signup = function() {
      Auth.signup($scope.user)
        .then(function(resp) {
          if (resp.data.token) {
            $window.localStorage.setItem('spartanShield', resp.data.token);
            $rootScope.$broadcast('userAction');
            $scope.close();
          } else {
            if (resp.data.err) {
              $scope.message = resp.data.err;
            }
          }
        });
    };
  }]);
