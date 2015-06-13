var sv = angular.module('server', ['ionic', 'config', 'util', 'social']);

sv.service('server', function($http, config, $rootScope, socialProvider) {

    var that = this;
    that.sessionKey = '';
    that.sessionAcquireTS = 0;
    that.prices = {};

    var badSessionError = -1013;
    var sessionExpiration = 60 * 59; // 59 min

    function rawPromise(data) {
        return $http.post(config.server, data);
    }

    function isGood(r) {
        return r && r.result && r.result == 'good';
    }

    that.rawRequest = function(data) {
        return rawPromise(data).success(function (r) {
            if(!isGood(r)) {
                r.type = 'logic';
                that.onError(r);
            }
        }).error( function () {
            that.onError({type: 'inet'});
        });
    };

    that.login = function() {
        var loginData = socialProvider.getLoginData();
        loginData.method = 'login';

        $rootScope.$broadcast('loggingIn', 'start');
        that.rawRequest(loginData).success(function(r) {
            // todo
            console.log('login', r);
            that.me = that.getAnswer(r, 'user');
            that.sessionKey = that.getAnswer(r, 'login').sid;

        }).finally(function() {
            $rootScope.$broadcast('loggingIn', 'end');
        });
    };

    that.onError = function(r) {
        $rootScope.$broadcast('serverError', r);
    };


    that.getAnswer = function(r, name) {
        var a = r['answers'];
        if(a)
            for(var i = 0; i < a.length; ++i)
                if(a[i][name])
                    return a[i][name];
        return null;
    };

    that.getAllAnswers = function(r, name) {
        var a = r['answers'];
        var res = [];
        if(a)
            for(var i = 0; i < a.length; ++i)
                if(a[i][name])
                    res.push(a[i][name]);
        return res;
    };
});

app.controller('errorController', function ($rootScope, $scope, $ionicPopup, $ionicLoading) {

    $rootScope.$on('serverError', function (event, data) {
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

    $rootScope.$on('loggingIn', function (event, state) {

        $scope.loadingType = 'auth';
        if(state == 'start')
            $ionicLoading.show({
                scope: $scope,
                templateUrl: 'tpl/loading.html'
            });
        else
            $ionicLoading.hide();
    });
});