
var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
    return $window._; // assumes underscore has already been loaded on the page
}]);

var app = angular.module('balda', ['ionic', 'gameplay', 'util', 'underscore']);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('top');

    $stateProvider
        .state('auth', {
            url: '/auth',
            templateUrl : 'tpl/auth.html',
            controller: 'authController'
        })
        .state('tabs', {
            url: '/tabs',
            abstract: true,
            templateUrl: 'tpl/tabs.html',
            controller: function($scope, $ionicHistory) {
                $scope.onTabSelected = function() {
                    $ionicHistory.clearHistory();
                }
            }
        })
        .state('tabs.matchlist', {
            url: '/matchlist',
            views: {
                'matchlist': {
                    templateUrl: 'tpl/matchlist.html',
                    controller: 'matchlistController'
                }
            }
        })
        .state('tabs.gameplay', {
            url: '/gameplay',
            views: {
                'matchlist': {
                    templateUrl: 'tpl/gameplay.html',
                    controller: 'gameplayController'
                }
            }
        })
        .state('tabs.newgame', {
            url: '/newgame',
            views: {
                'newgame': {
                    templateUrl: 'tpl/newgame.html',
                    controller: 'newGameController'
                }
            }
        })
        .state('tabs.tournament', {
            url: '/tournament',
            views: {
                'tournament': {
                    templateUrl: 'tpl/tournament.html',
                    controller: 'tournamentController'
                }
            }
        })
        .state('tabs.profile', {
            url: '/profile',
            views: {
                'profile': {
                    templateUrl: 'tpl/profile.html',
                    controller: 'myProfileController'
                }
            }
        })
        .state('tabs.settings', {
            url: '/settings',
            views: {
                'settings': {
                    templateUrl: 'tpl/settings.html',
                    controller: 'settingsController'
                }
            }
        });

    $urlRouterProvider.otherwise('/auth');
});


app.controller('matchlistController', function ($scope, $state) {

});

app.controller('settingsController', function ($scope, prices, $state, server) {

    var m = $scope.model = {
        prices: {}
    };

    $scope.logout = function() {
        $state.go('auth');
        server.logout();
    };

    prices.load().then(function() {
        m.prices = prices.prices;
    });
});

app.controller('appController', function ($scope, $ionicPopup, $ionicLoading, server, $state) {

    server.eventScope.$on('loggingIn', function (event, state) {

        $scope.loadingType = 'auth';
        if(state == 'start')
            $ionicLoading.show({
                scope: $scope,
                templateUrl: 'tpl/loading.html'
            });
        else {
            $ionicLoading.hide();

            if(server.isLoggedIn()) {
                $state.go('tabs.newgame');
            } else {
                $state.go('auth');
            }
        }
    });
});

app.controller('errorController', function (server, $scope, $ionicPopup) {

    server.eventScope.$on('serverError', function (event, data) {
        $scope.data = data;

        $ionicPopup.show({
            title: 'Ошибка!',
            scope: $scope,
            templateUrl: 'tpl/error.html',
            buttons: [
                { text: 'ОK' }
            ]
        });
    });

});