var sv = angular.module('server', ['ionic', 'config', 'util']);

sv.service('server', function($http, config, $rootScope, $q) {

    var that = this;
    that.sessionKey = '';
    that.sessionAcquireTS = 0;
    that.prices = {};

    that.makeGeneralRequest = function(data) {
        return $http.post(config.server, data);
    };

    that.onError = function(r) {
        $rootScope.$broadcast('serverError', r);
    };

    that.makeRequest = function(data) {
        if(that.sessionKey !== '')
            data.session = that.sessionKey;
        return that.makeGeneralRequest(data).success(function (r) {
            if(r.result == 'bad') {
                r.type = 'logic';
                that.onError(r);
            }
        }).error( function () {
            that.onError({type: 'inet'});
        });
    };

    that.getAnswer = function(r, name) {
        var a = r['answers'];
        if(a)
            for(var i = 0; i < a.length; ++i)
                if(a[i][name])
                    return a[i][name];
        return null;
    };

    that.getPrices = function() {
        return that.makeRequest({
            method: 'prices'
        }).success(function (r) {
            var prices = that.getAnswer(r, 'prices');
            angular.forEach(prices, function (v, k) {
                v.name = k;
            });
            that.prices = prices;
        });
    };

    that.login = function(uid, token, name, sex, photoURL) {

        var data = {
            method: 'login',
            uid: uid,
            token: token
        };
        if(name) data.name = name;
        if(sex) data.sex = +sex;
        if(photoURL) data.photoURL = photoURL;

        return that.makeRequest(data);
    };

});


app.controller('errorController', function ($rootScope, $scope, $ionicPopup) {

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
});