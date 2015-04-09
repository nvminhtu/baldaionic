
angular.module('balda').controller('authController', function ($scope, $state, $ionicLoading, socialProvider, server) {

    var m = $scope.model = {
        name: '',
        loading: false,
        isError: true
    };


    $scope.$watch('model.name', function() {
        var name = m.name.trim();
        m.isError = name.length < 2 || name.length >= 32;
        socialProvider.name = name;
    });

    $scope.gotoGameplay = function() {
        $state.go('gameplay');
    };

    $scope.authorizeMe = function() {
        //if(user.name.length > 0) {
        //
        //    $state.go('tabs.newgame');
        //    //user.name = '';
        //    //$scope.loading = true;
        //
        //    // $ionicLoading.show({
        //    //     template: 'Please wait while we register your device...'
        //    // });
        //}
        //else
        //    alert('No name');
        if(!m.isError) {
            server.login();
            $state.go('tabs.newgame');
        }
    };
});