
angular.module('balda').controller('matchlistController', function ($scope, $ionicHistory) {
    $scope.$on('$ionicView.enter', function() {
        $ionicHistory.clearHistory();
    });
});
