var app = angular.module('balda');

app.directive('userPic', function () {

});

app.controller('myProfileController', function ($scope, server) {
    var m = $scope.model = {
        me: server.me
    };
});