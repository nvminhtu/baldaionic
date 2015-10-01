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


app.controller('myProfileController', function ($scope, profileCache) {
    var m = $scope.model = {
        me: profileCache.me
    };

    $scope.$on('$ionicView.enter', function() {
        $scope.$digest();
    });
});