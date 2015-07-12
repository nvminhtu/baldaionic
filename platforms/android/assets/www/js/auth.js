
var app = angular.module('balda');

app.run(function (socialProvider, server, $state) {

});

app.controller('authController', function ($scope, $state, $ionicLoading, socialProvider, server) {

    var m = $scope.model = {
        name: '',
        loading: false,
        isError: true
    };

    $scope.$watch('model.name', function() {
        var name = m.name.trim();
        m.isError = name.length < 2 || name.length >= 32;
        socialProvider.name = name;
    });

    //$scope.gotoGameplay = function() {
    //    $state.go('gameplay');
    //};

    function loginAndGo()
    {
        server.login();
    }


    if(socialProvider.hasLoginData())
    {
        loginAndGo();
    }

    $scope.authorizeMe = function() {
        if(!m.isError) {
            loginAndGo();
        }
    };
});