angular.module('recipes.search', [])
    .directive('search', ['$rootScope', '$state', function($rootScope, $state) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/directives/search/search.html',
            controller: 'SearchCtrl',
            link: function(scope, el, attr) {
                $rootScope.search = true;
                var searchbar = el.find('#searchtext');
                var pastValue = '';
                scope.$on('keypress', function(onEvent, keypressEvent) {
                    if ($rootScope.search) {

                        // On enter search for the value
                        if (keypressEvent.which === 13) {
                            $rootScope.$broadcast('search', searchbar.val().toLowerCase());
                            searchbar.val('').blur();
                            el.fadeOut(200);

                        } else {
                            //If the search bar is not visible, fill it with the pressed character
                            if (!el.is(':visible')) {
                                searchbar.val(String.fromCharCode(keypressEvent.which));
                            }
                            //Else add the character to the string
                            var charStr = String.fromCharCode(keypressEvent.which);
                            //This eliminates the unicode error because also delete the previous character if a non character key is pressed
                            if (/[^a-zA-Z\b]/.test(charStr) && keypressEvent.which !== 27) {
                                searchbar.val(pastValue);
                            }
                            searchbar.focus();
                            el.fadeIn(200);
                            if (keypressEvent.which !== 27) {
                                pastValue = searchbar.val();
                            }
                        }
                    }
                    // On escape clear the search bar
                    if (keypressEvent.which === 27) {
                        searchbar.val('').blur();
                        pastValue = '';
                        el.fadeOut(200);
                    } else {
                        searchbar.val(pastValue);
                    }
                });
            }
        };
    }])
    .controller('SearchCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $scope.searching = false;
    }]);
