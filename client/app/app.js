
angular.module('recipes', [
  'recipes.recipes',
  'recipes.services',
  'recipes.keypress',
  'recipes.search',
  'ui.router',
  'ui.bootstrap'
])
.config(function($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('recipe', {
      url: '/recipe/:query',
      templateUrl: 'app/recipe/recipe.html',
      controller: 'RecipeCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('search.details', {
      url: '/recipes/:recipe',
      templateUrl: 'app/views/partial_recipe-detail.html',
      data: {
        requireLogin: false
      }
    })
    .state('list', {
      url: '/list',
      templateUrl: 'app/shoppingList/shoppingList.html',
      controller: 'ShoppingListCtrl',
      data: {
        requireLogin: false
      }
    });

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
})

// we will use this when we implement jwt
//
.factory('AttachTokens', function ($window) {

  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('spartanShield');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      if(toState && toState.data.requireLogin && !Auth.isAuth()) {
        $location.path('/');
      }
  });
});
