
angular.module('AuthFactory', [])
.factory('Auth', function ($http, $location, $window) {

  var login = function (user) {
    console.log(user);
    return $http({
      method: 'POST',
      url: '/api/users/login',
      data: user
    })
    .then(function (resp) {
      return resp;
    });
  };

  var signup = function (user) {
    console.log(user);
    return $http({
      method: 'POST',
      url: '/api/users/register',
      data: user
    })
    .then(function (resp) {
      return resp;
    });
  };

  var googleAuth = function (user) {
    return $http({
      method: 'GET',
      url: '/auth/google'
    })
    .then(function (resp) {
      console.log(resp);
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('spartanShield');
  };

  var logout = function () {
    $window.localStorage.removeItem('spartanShield');
    $location.path('/');
  };

  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    logout: logout,
    googleAuth: googleAuth
  };
});