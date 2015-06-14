angular.module('server').service('tournament', function(server) {
    var that = this;

    that.topPlayers = {};

    that.load = function() {
        return server.rawRequest({
            method: 'leaderboardTop'
        }).success(function (r) {
            // todo: parse leaderboard test

        });
    };
});


app.controller('tournamentController', function ($scope, tournament) {
    var m = $scope.model = {
        top: tournament.topPlayers
    };

});