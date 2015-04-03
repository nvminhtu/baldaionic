var gp = angular.module('gameplay', ['ionic', 'selectLetter', 'server']);

gp.config(function ($stateProvider) {

    $stateProvider
        .state('gameplay', {
            url: '/gameplay',
            templateUrl: 'tpl/gameplay.html',
            controller: 'gameplayController'
        });
});

gp.constant('fieldConst', {
    max: 5,
    cellType: {
        free: ['fieldcell', 'fieldcell-empty'],
        available: ['fieldcell', 'fieldcell-available'],
        filledMyOld: ['fieldcell', 'fieldcell-filled-my'],
        filledMyNew: ['fieldcell', 'fieldcell-filled-my-new'],
        filledTheirOld: ['fieldcell', 'fieldcell-filled-their'],
        filledTheirNew: ['fieldcell', 'fieldcell-filled-their-new']
    }
});

gp.run(function (server) {
    server.test();
});

gp.controller('gameplayController', function ($scope, fieldConst) {


    function init()
    {
        for(var i = 0; i < fieldConst.max * fieldConst.max; ++i) {
            $scope.cells.push({
                val: '',
                class: fieldConst.cellType.free,
                x: i % fieldConst.max,
                y: (i / fieldConst.max | 0)
            });
        }

        $scope.fillCell(0, 2, 'Б', fieldConst.cellType.filledMyOld);
        $scope.fillCell(1, 2, 'А', fieldConst.cellType.filledMyOld);
        $scope.fillCell(2, 2, 'Л', fieldConst.cellType.available);
        $scope.fillCell(3, 2, 'Д', fieldConst.cellType.available);
        $scope.fillCell(4, 2, 'А', fieldConst.cellType.available);
        $scope.fillCell(1, 3, 'Л', fieldConst.cellType.filledMyNew);
    }

    $scope.cells = [];

    $scope.cells = [];

    $scope.selectionEnabled = true;
    $scope.selectedPath = [];
    $scope.hasEmptyCell = false;


    function coord(x, y) { return x + fieldConst.max * y; }

    function getCell(x, y) {
        return $scope.cells[coord(x, y)];
    }

    function setCell(x, y, cell) {
        var i = coord(x, y);
        $scope.cells[i] = angular.extend($scope.cells[i], cell);
    }

    $scope.clickCell = function(c) {
        $scope.openSelectLetter();
    };

    $scope.fillCell = function(x, y, c, type) {
        setCell(x, y, {
            val: c,
            class: type
        })
    };

    $scope.cellTrackerMove = function(x, y) {

        setCell(x, y, {
            class: fieldConst.cellType.filledMyNew
        });
        $scope.$digest();
    };

    $scope.openSelectLetter = function () {
        $scope.$broadcast('showSelectLetter');
    };

});

gp.directive("cellTracker", function() {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attrs) {

            function move(event)
            {
                event.preventDefault();

                var e;
                if(event.touches)
                    e = event.touches[0];
                else if(event.which == 1)
                    e = event;

                if(e && scope.cellTrackerMove)
                {
                    var el = document.elementFromPoint(e.pageX, e.pageY);
                    if(el)
                    {
                        var x = el.getAttribute('cell-x');
                        var y = el.getAttribute('cell-y');
                        if (x !== null && y != null)
                            scope.cellTrackerMove(+x, +y);
                    }
                }
            }

            function end(event)
            {
                if(scope.cellTrackerEnd)
                    scope.cellTrackerEnd();
            }

            element.on("touchmove", move);
            element.on("mousemove", move);
            element.on('touchend', end);
            element.on('mouseup', end);
        }
    };
});