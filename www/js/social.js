var soc = angular.module('social', ['ionic', 'util', 'config']);

soc.service('socialProvider', function($localStorage, util) {

    var that = this;

    that.name = '';

    function generatePair()
    {
        return {
            uid: 'anonym_' + util.makeID(6),
            token: util.makeID(12),
            name: that.name
        };
    }

    var LOGIN_DATA_KEY = 'saved_login_data';

    function getLoginDataFromStorage()
    {
        return $localStorage.getObject(LOGIN_DATA_KEY);
    }

    function saveLoginData(data)
    {
        $localStorage.setObject(LOGIN_DATA_KEY, data);
    }

    function regenerate() {
        saveLoginData(generatePair());
    }

    that.hasLoginData = function() {
        var data = getLoginDataFromStorage();
        return (data.uid && data.token);
    };

    that.getLoginData = function() {
        var data = getLoginDataFromStorage();
        if(!data.uid || !data.token)
        {
            regenerate();
        }
        return data;
    };

});