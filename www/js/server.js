var sv = angular.module('server', ['ionic', 'config']);

sv.service('server', function($http, config) {

    this.test = function() {
        $http.get(config.server + '?method=prices')
            .success(function (result) {
                console.log(result);
            })
            .error(function (result) {

            });
    };
});