var sv = angular.module('server', ['ionic', 'config']);

sv.service('server', function($http, config) {

    var that = this;
    that.sessionKey = '';
    that.sessionAcquireTS = 0;
    that.prices = {};

    that.makeGeneralRequest = function(data) {
        return $http.post(config.server, data);
    };

    that.makeRequest = function(data) {
        if(that.sessionKey !== '')
            data.session = that.sessionKey;
        return that.makeGeneralRequest(data);
    };

    that.getAnswer = function(r, name) {
        for(var i = 0; i < r.answers.length; ++i)
            if(r.answers[i][name])
                return r.answers[i][name];
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

});