angular.module('UserFactory', [])
  .factory('User', ['$http', '$window', '$q', 'Auth', function($http, $window, $q, Auth) {

    var getUserList = function() {
      if (Auth.isAuth()) {
        var jwt = $window.localStorage.getItem('spartanShield');
        return $http({
            method: 'POST',
            url: '/api/users',
            data: {
              token : jwt
            }
          })
          .then(function(resp) {
            return resp.data.recipeCollection;
          });
      } else {
      	return false;
      }
    };

    var updateUserList = function(list) {
      if (Auth.isAuth()) {
        var jwt = $window.localStorage.getItem('spartanShield');
        return $http({
            method: 'PUT',
            url: '/api/users',
            data: {
              token: jwt,
              list: list
            }
          })
          .then(function(resp) {
            return resp;
          });
      } else {
      	return $q.defer().reject('Not Logged In');
      }
    };

    return {
      getUserList: getUserList,
      updateUserList: updateUserList
    };
  }]);
