angular.module('server').service('tournament', function(server) {
    var that = this;

    that.topPlayers = {};
    that.totalPlayers = 0;

    that.load = function() {
        return server.request({
            method: 'leaderboardTop'
        }).then(function (r) {
            that.topPlayers = r.getAnswer('leaderboardEntries');
            that.totalPlayers = r.getAnswer('leaderboardTotal')['totalRecords'];
            return r;
        });
    };
});


app.controller('tournamentController', function ($scope, tournament, profileCache, _) {

    var m = $scope.model = {
        topPlayers: [],
        totalPlayers: 0
    };

    $scope.$on( "$ionicView.enter", function () {
        tournament.load().then(function() {
            m.topPlayers = tournament.topPlayers;
            m.totalPlayers = tournament.totalPlayers;
            _.each(m.topPlayers, function (player) {
                 profileCache.loadById(player.profileID).then(function (profile) {
                    player.profile = profile;
                 });
            });
        });
    });

});