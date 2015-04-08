var app = angular.module('balda', ['ionic', 'gameplay', 'util']);

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

app.config(function ($stateProvider, $urlRouterProvider) {

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
                    templateUrl: 'tpl/newgame.html'
                }
            }
        })
        .state('tabs.tournament', {
            url: '/tournament',
            views: {
                'tournament': {
                    templateUrl: 'tpl/tournament.html'
                }
            }
        })
        .state('tabs.profile', {
            url: '/profile',
            views: {
                'profile': {
                    templateUrl: 'tpl/profile.html'
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

    $urlRouterProvider.otherwise('/tabs/matchlist');
});


app.controller('matchlistController', function ($scope, $state) {

});

app.controller('settingsController', function ($scope, server, $ionicLoading) {

    //$ionicLoading.show({
    //    template: '<ion-spinner class="spinner-light" icon="android"></ion-spinner><br>Загрузка...'
    //});

    var m = $scope.model = {
        prices: {}
    };

    server.getPrices().then(function() {
        m.prices = server.prices;
    });
});

app.controller('authController', function ($scope, $state, $ionicLoading) {

    $scope.user = {
        name: '',
        loading: false
    };

    $scope.gotoGameplay = function() {
        $state.go('gameplay');
    };

    $scope.authorizeMe = function(user) {
        //if(user.name.length > 0) {
        //
        //    $state.go('tabs.newgame');
        //    //user.name = '';
        //    //$scope.loading = true;
        //
        //    // $ionicLoading.show({
        //    //     template: 'Please wait while we register your device...'
        //    // });
        //}
        //else
        //    alert('No name');
        $state.go('tabs.newgame');
    };
});