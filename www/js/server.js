var sv = angular.module('server', ['ionic', 'config', 'util', 'social', 'underscore']);

sv.service('server', function($http, config, $rootScope, socialProvider, util, $interval, _) {

    var that = this;

    that.methodsWithNoSession = [
        'prices',
        'login'
    ];
    that.sessionKey = '';
    that.sessionAcquireTS = 0;
    that.eventScope = $rootScope.$new();

    var ERROR_BAD_SESSION = -1013;
    var SESSION_EXPIRATION = 60 * 59; // 59 min

    function rawPromise(data) {
        return $http.post(config.server, data);
    }

    function isGood(r) {
        return r && r.result && r.result == 'good';
    }

    that.isSessionExpired = function() {
        return (util.now() - that.sessionAcquireTS) > SESSION_EXPIRATION;
    };

    function processAnswers(answers) {

        for(var i = 0; i < answers.length; ++i) {
            var a = answers[i];
            var keys = _.keys(a);
            if(keys.length > 0)
                that.eventScope.$broadcast('serverAnswer', {
                    name: keys[0],
                    data: a[keys[0]]
                });
        }
    }

    that.rawRequest = function(data) {
        console.log('Server Request: ', data);
        return rawPromise(data).success(function (r) {
            if(!isGood(r)) {
                r.type = 'logic';
                that.onError(r);
                console.log('Server error (logic): ', r);
            } else {
                console.log('Server Response: ', r);
                processAnswers(r['answers']);
            }
        }).error( function () {
            console.error('Server error (network)!');
            that.onError({type: 'inet'});
        });
    };

    function hasSession() {
        return that.sessionKey != '';
    }

    that.isLoggedIn = function() {
        return hasSession() && that.isSessionExpired();
    };

    var loggingIn = false;

    that.login = function() {

        if(loggingIn) {
            console.log('login exit; already in progess...');
            return;
        }

        var loginData = socialProvider.getLoginData();
        loginData.method = 'login';

        loggingIn = true;
        console.log('logging in...');

        that.eventScope.$broadcast('loggingIn', 'start');
        that.rawRequest(loginData).success(function(r) {

            that.me = that.getAnswer(r, 'user');
            that.sessionKey = that.getAnswer(r, 'login').sid;
            that.sessionAcquireTS = util.now();

        }).finally(function() {
            loggingIn = false;
            that.eventScope.$broadcast('loggingIn', 'end');
        });
    };

    that.onError = function(r) {
        that.eventScope.$broadcast('serverError', r);
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

    that.logout = function() {
        that.sessionKey = '';
        that.sessionAcquireTS = 0;
    };

    that.logout();

    $interval(function() {
        if(hasSession() && that.isSessionExpired()) {
            console.log('Server: session expired!');
            that.login();
        }
    }, 5000);
});

sv.service('prices', function(server) {
    var that = this;

    that.prices = {};

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