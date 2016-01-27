var app = angular.module('balda');

app.controller('newGameController', function ($scope, prices, $state, server, util, profileCache) {

    $scope.setRecentIds = function (arrOfIds) {
        // todo
    };

    $scope.recent = [1,2,3];

    util.log('test', 'lol');

});
