angular.module('server').service('profileCache', function(util, server, _, $q) {
    var that = this;

    that.cache = {};
    that.cacheUid = {};
    that.me = {};

    that.add = function(profile) {
        util.log('profile', 'adding profile', profile);
        if(profile && profile.id != 0) {
            var alreadyUser = that.cache[profile.id];
            if(!alreadyUser) alreadyUser = {};
            alreadyUser = that.cache[profile.id] = _.extend(alreadyUser, profile);
            that.cacheUid[profile.uid] = alreadyUser;

            if(server.me && server.me.id == profile.id) {
                that.me = alreadyUser;
                alreadyUser.local = true;
            } else
                alreadyUser.local = false;

            return alreadyUser;
        }
    };

    that.getById = function(profileID) {
        return that.cache[profileID];
    };

    that.getByUid = function(uid) {
        return that.cacheUid[uid];
    };

    that.loadById = function(id) {

        var profile;
        if(profile = that.getById(id)) {
            var d = $q.defer();
            d.resolve(profile);
            return d.promise;
        } else {
            return server.request({
                method: 'userGet',
                by: 'id',
                uid: id
            }).then(function () {
                return that.getById(id);
            });
        }
    };

    server.eventScope.$on(server.EVENT_ANSWER + 'user', function(event, data) {
        that.add(data);
    });

});
