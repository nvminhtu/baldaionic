var gp = angular.module('gameplay', ['ionic', 'selectLetter', 'server']);

gp.config(function ($stateProvider) {


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

gp.controller('gameplayController', function ($scope, fieldConst) {

    var m = $scope.model = {
        cells: [],
        selectedPath: [],
        selectionEnabled: true,
        hasEmptyCell: false
    };

    function fillCell(x, y, c, type) {
        setCell(x, y, {
            val: c,
            class: type
        });
    }

    function init()
    {
        for(var i = 0; i < fieldConst.max * fieldConst.max; ++i) {
            m.cells.push({
                val: '',
                class: fieldConst.cellType.free,
                x: i % fieldConst.max,
                y: (i / fieldConst.max | 0)
            });
        }

        fillCell(0, 2, 'Б', fieldConst.cellType.filledMyOld);
        fillCell(1, 2, 'А', fieldConst.cellType.filledMyOld);
        fillCell(2, 2, 'Л', fieldConst.cellType.available);
        fillCell(3, 2, 'Д', fieldConst.cellType.available);
        fillCell(4, 2, 'А', fieldConst.cellType.available);
        fillCell(1, 3, 'Л', fieldConst.cellType.filledMyNew);
    }

    function coord(x, y) { return x + fieldConst.max * y; }

    function getCell(x, y) {
        return m.cells[coord(x, y)];
    }

    function setCell(x, y, cell) {
        var i = coord(x, y);
        m.cells[i] = angular.extend(m.cells[i], cell);
    }


    $scope.cellTrackerMove = function(x, y) {

        setCell(x, y, {
            class: fieldConst.cellType.filledMyNew
        });
        $scope.$digest();
    };

    $scope.cellTrackerEnd = function() {
        $scope.openSelectLetter();
    };

    $scope.openSelectLetter = function () {
        $scope.$broadcast('showSelectLetter');
    };

    init();
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
                event.preventDefault();

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