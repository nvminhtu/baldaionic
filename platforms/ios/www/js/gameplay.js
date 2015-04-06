var gp = angular.module('gameplay', ['ionic', 'selectLetter', 'server']);

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

function isCellFree(cell) { return cell == null || !cell.val || cell.val == ''; }

function SelectionPath() {
    var t = this;
    t.path = [];
    t.getLength = function() { return t.path.length; };
    t.getLast = function() {
        if(t.path.length > 0) return t.path[t.path.length - 1];
        else return null;
    };
    t.isLastCoord = function(x, y) {
        var last = t.getLast();
        return last && last.x == x && last.y == y;
    };
    t.clear = function() { t.path = []; };
    t.isValid = function() {
        var numberOfNew = 0;
        var numberOfOld = 0;

        for(var i = 0; i < t.path.length; ++i)
            if(isCellFree(t.path[i]))
                ++numberOfNew;
            else
                ++numberOfOld;

        return numberOfNew == 1 && numberOfOld >= 1;
    };
    t.hasInPathCoord = function(x, y) {
        for(var i = 0; i < t.path.length; ++i)
        {
            var cell = t.path[i];
            if(cell.x == x && cell.y == y) return true;
        }
        return false;
    };
    t.pushCell = function(cell) {
        t.path.push(cell);
    };
    t.deleteLast = function() {
        if(t.path.length > 0)
            t.path = t.path.slice(0, t.path.length - 1);
    };
}

gp.controller('gameplayController', function ($scope, fieldConst) {

    var fieldMax = fieldConst.max;
    var fieldTotal = fieldMax * fieldMax;
    var cellTypes = fieldConst.cellType;

    var m = $scope.model = {
        cells: [],
        selectedPath: new SelectionPath(),
        selectionEnabled: true,
        selectionStarted: false,
        lastCoords: {x: 0, y: 0}
    };

    function fillCell(x, y, c, type) {
        setCell(x, y, {
            val: c,
            class: type
        });
    }


    function init()
    {
        for(var i = 0; i < fieldTotal; ++i) {
            var cell = {
                val: '',
                class: cellTypes.free,
                x: i % fieldMax,
                y: (i / fieldMax | 0)
            };
            m.cells.push(cell);
        }

        fillCell(0, 2, 'Б', cellTypes.filledMyOld);
        fillCell(1, 2, 'А', cellTypes.filledMyOld);
        fillCell(2, 2, 'Л', cellTypes.available);
        fillCell(3, 2, 'Д', cellTypes.available);
        fillCell(4, 2, 'А', cellTypes.available);
        fillCell(1, 3, 'Л', cellTypes.filledMyNew);

        clearField();
    }

    function doesCellHasFilledNeighbors(x, y)
    {
        return [
            {x: x - 1, y: y},
            {x: x + 1, y: y},
            {x: x, y: y + 1},
            {x: x, y: y - 1}
        ].map(function (coord) {
             return getCell(coord.x, coord.y);
        }).reduce(function (prev, cur) {
                return prev || !isCellFree(cur);
            }, false);
    }

    function clearField()
    {
        for(var i = 0; i < fieldTotal; ++i) {
            var cell = m.cells[i];
            var cellType;
            if(!isCellFree(cell))
                cellType = cellTypes.available;
            else if(doesCellHasFilledNeighbors(cell.x, cell.y))
                cellType = cellTypes.available;
            else
                cellType = cellTypes.free;

            cell.class = cellType;
        }
    }

    function coord(x, y) { return x + fieldMax * y; }

    function getCell(x, y) {
        if(x < 0 || y < 0 || x >= fieldMax || y >= fieldMax)
            return null;
        return m.cells[coord(x, y)];
    }

    function setCell(x, y, cell) {
        var i = coord(x, y);
        m.cells[i] = angular.extend(m.cells[i], cell);
    }

    function onSelectionMove(x, y) {
        console.log('move', x, y);

        m.selectedPath.pushCell(getCell(x, y));

        setCell(x, y, {
                class: fieldConst.cellType.filledMyNew
            });
        $scope.$digest();


    }

    $scope.cellTrackerMove = function(x, y) {
        if(!m.selectionStarted || (x != m.lastCoords.x || y != m.lastCoords.y))
        {
            if(!m.selectionStarted) {
                m.selectionStarted = true;
                clearField();
            }
            onSelectionMove(x, y);
            m.lastCoords = {x: x, y: y};
        }
    };

    $scope.cellTrackerEnd = function() {
        if(m.selectedPath.isValid())
            $scope.openSelectLetter();
        m.selectionStarted = false;
        m.selectedPath.clear();

        console.log('stop!');
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