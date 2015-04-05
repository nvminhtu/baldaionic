var cfg = angular.module('config', []);

cfg.run(function () {
    alert(window.location.host == '' ? 'null' : 'not null');
});

cfg.constant('config', {
    server: 'http://test.erudite-express.ru/balda/api?config=ios_pub'
});