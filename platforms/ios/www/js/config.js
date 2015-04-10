var cfg = angular.module('config', []);

cfg.constant('config', (function () {
    var consts = {};
    consts.host = 'test.erudite-express.ru';
    consts.server = 'http://' + consts.host + '/balda/api/index.php?config=ios_pub';
    return consts;
}()));