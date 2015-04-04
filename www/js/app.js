var app = angular.module('balda', ['ionic', 'gameplay']);

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
            url: '/tab',
            abstract: true,
            templateUrl: 'tpl/tabs.html'
        })
        .state('tabs.matchlist', {
            url: '/matchlist',
            views: {
                'matchlist': {
                    templateUrl: 'tpl/matchlist.html'
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
                    templateUrl: 'tpl/settings.html'
                }
            }
        });

    $urlRouterProvider.otherwise('/auth');
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