var app = angular.module('balda');

app.directive('fallbackSrc', function () {
    return {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    };
});

app.directive('userPic', function () {
    return {
        restrict: 'EA',
        template: function(element, attrs) {
            return '<img class="userpic" src="' + attrs.photoUrl + '" fallback-src="img/blank-avatar.png">';
        }
    }
});

app.controller('myProfileController', function ($scope, server) {
    var m = $scope.model = {
        me: server.me
    };

});