var util = angular.module('util', []);

util.factory('$localStorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]);

util.factory('util', function () {

    var allowedChannels = [

    ];

    return {
        makeID: function(len) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            len = len || 5;
            for( var i=0; i < len; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        },

        now: function() {
            return Math.floor(Date.now() / 1000);
        },

        log: function() {
            var chan = arguments[0];
            if(chan == '!' || allowedChannels.length == 0 || allowedChannels.indexOf(chan) !== -1)
                console.log.apply(console, arguments);
        },

        thisis: function (x, defaultValue) {
            return (typeof x === 'undefined') ? defaultValue : x;
        }
    };
});

util.directive('userPic', function () {
    return {
        restrict: 'EA',
        template: function(element, attrs) {
            var cls = attrs.small ? 'userpic-sm' : 'userpic';
            return '<img class="' + cls + '" src="' + attrs.photoUrl + '" fallback-src="img/blank-avatar.png">';
        }
    }
});

util.directive('number', function (util) {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        link: function ($scope, $element, $attrs) {
            $scope.$watch('value', function () {
                var n = parseInt($scope.value);
                var fr = n % 10;
                var word = $attrs.five;
                if(fr == 1) word = $attrs.one;
                else if(fr < 5 && fr != 0) word = $attrs.two;
                $scope.result = n + ' ' + word;

                util.log('number', 'N = ', $scope.value); // todo
            });
        },

        template: '{{result}}'
    }
});
