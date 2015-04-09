var gp = angular.module('gameplay', ['ionic', 'server']);

gp.constant('fieldConst', {
    max: 5,
    cellType: {
        free: ['fieldcell', 'fieldcell-empty'],
        available: ['fieldcell', 'fieldcell-available'],
        filledMyOld: ['fieldcell', 'fieldcell-filled-my'],
        filledMyNew: ['fieldcell', 'fieldcell-filled-my-new'],
        filledTheirOld: ['fieldcell', 'fieldcell-filled-their'],
        filledTheirNew: ['fieldcell', 'fieldcell-filled-their-new'],
        nextPossible: ['fieldcell', 'fieldcell-can-be-next']
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
    t.getNewCell = function() {
        for(var i = 0; i < t.path.length; ++i) {
            if (isCellFree(t.path[i]))
                return t.path[i];
        }
        return null;
    };
    t.indexOfCellWithCoords = function(x, y) {
        for(var i = 0; i < t.path.length; ++i)
        {
            var cell = t.path[i];
            if(cell.x == x && cell.y == y) return i;
        }
        return null;
    };
    t.hasInPathCoord = function(x, y) {
        return t.indexOfCellWithCoords(x, y) !== null;
    };
    t.isNeighborToLast = function(x, y, defaultIfNotLast) {
        var last = t.getLast();
        if(!last) return defaultIfNotLast;
        var delta = Math.abs(last.x - x) + Math.abs(last.y - y);
        return delta == 1;
    };
    t.pushCell = function(cell) {
        var l = t.getLength();
        var x = cell.x, y = cell.y;
        var i = t.indexOfCellWithCoords(x, y);
        if(i !== null)
        {
            t.path = t.path.slice(0, i + 1);
            return false;
        }
        else if(isCellFree(cell) && t.getNewCell() != null)
            return false;
        else if(!t.isNeighborToLast(x, y, true))
            return false;
        else {
            t.path.push(cell);
            return true;
        }
    };
    t.deleteLast = function() {
        if(t.path.length > 0)
            t.path = t.path.slice(0, t.path.length - 1);
    };
    t.getWord = function() {
        return t.path.reduce(function (prev, next) {
            return prev + next.val;
        }, '');
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

        syncField();
    }

    function neighbors(x, y)
    {
        return [
            {x: x - 1, y: y},
            {x: x + 1, y: y},
            {x: x, y: y + 1},
            {x: x, y: y - 1}
        ];
    }

    function neighborsCell(x, y)
    {
        return neighbors(x, y).map(function (coord) {
            return getCell(coord.x, coord.y);
        });
    }

    function doesCellHasFilledNeighbors(x, y)
    {
        return neighborsCell(x, y).reduce(function (prev, cur) {
                return prev || !isCellFree(cur);
            }, false);
    }

    function syncField()
    {
        var hasNewCell = m.selectedPath.getNewCell() != null;
        for(var i = 0; i < fieldTotal; ++i) {
            var cell = m.cells[i];
            var x = cell.x, y = cell.y;
            var isFree = isCellFree(cell);
            var cellType;
            if(m.selectedPath.hasInPathCoord(x, y))
                cellType = cellTypes.filledMyOld;
            else if(m.selectionStarted && m.selectedPath.isNeighborToLast(x, y, false) && ((isFree && !hasNewCell) || !isFree))
                cellType = cellTypes.nextPossible;
            else if(!isCellFree(cell))
                cellType = cellTypes.available;
            else if(doesCellHasFilledNeighbors(x, y))
                cellType = cellTypes.available;
            else
                cellType = cellTypes.free;

            cell.class = cellType;
        }
        if(!$scope.$$phase) $scope.$apply();
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
        m.selectedPath.pushCell(getCell(x, y));
        syncField();
    }

    function finishLetterSelection(letter)
    {
        if(letter == null)
        {
            m.selectedPath.clear();
        }
        else
        {
            var newCell = m.selectedPath.getNewCell();
            if(newCell)
            {
                newCell.val = letter;
                console.log('word = ', m.selectedPath.getWord());
            }
        }
        syncField();
    }

    $scope.cellTrackerMove = function(x, y) {
        if(!m.selectionStarted || (x != m.lastCoords.x || y != m.lastCoords.y))
        {
            if(!m.selectionStarted) {
                m.selectedPath.clear();
                m.selectionStarted = true;
            }
            onSelectionMove(x, y);
            m.lastCoords = {x: x, y: y};
        }
    };

    $scope.cellTrackerEnd = function() {
        if(m.selectedPath.isValid())
            $scope.openSelectLetter();
        else
            m.selectedPath.clear();
        m.selectionStarted = false;

        syncField();
    };

    $scope.openSelectLetter = function () {
        $scope.$broadcast('showSelectLetter', { callback: finishLetterSelection });
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