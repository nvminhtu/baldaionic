var sv = angular.module('server', ['ionic', 'config']);

sv.service('server', function($http, config) {

    var that = this;
    that.sessionKey = '';
    that.sessionAcquireTS = 0;

    that.makeGeneralRequest = function(data) {
        return $http.post(config.server, data);
    };

    that.makeRequest = function(data) {
        if(that.sessionKey !== '')
            data.session = that.sessionKey;
    };

});