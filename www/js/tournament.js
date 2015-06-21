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
        totalPlayers: 0,
        meOutsider: true,
        me: {}
    };

    $scope.$on( "$ionicView.enter", function () {
        tournament.load().then(function() {
            m.topPlayers = tournament.topPlayers;
            m.totalPlayers = tournament.totalPlayers;
            m.meOutsider = true;
            _.each(m.topPlayers, function (player) {
                 profileCache.loadById(player.profileID).then(function (profile) {
                     player.profile = profile;
                     if(profile.local)
                         m.meOutsider = false;
                 });
            });
            if(m.meOutsider)
                m.me = {
                    profile: profileCache.me,
                    score: profileCache.me.lb_score,
                    rank: profileCache.me.lb_rank
                };
        });
    });

});