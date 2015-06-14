angular.module('server').service('profileCache', function(server) {
    var that = this;

    that.cache = {};

    that.add = function(profile) {
        if(profile && profile.id != 0) {
            that.cache[profile.id] = profile;
        }
    };


});
