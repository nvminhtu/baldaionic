angular.module('server').service('prices', function(server) {
    var that = this;

    that.load = function() {
        return server.rawRequest({
            method: 'prices'
        }).success(function (r) {
            var prices = server.getAnswer(r, 'prices');
            angular.forEach(prices, function (v, k) {
                v.name = k;
            });

            that.prices = prices;
        });
    };

});