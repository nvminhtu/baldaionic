var sl = angular.module('selectLetter', ['ionic']);

sl.controller('selectLetterController', function ($ionicModal, $scope) {

    $ionicModal.fromTemplateUrl('tpl/selectletter.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.$on('showSelectLetter', function () {
        $scope.openModal();
    });

    $scope.selectLetter = function(i) {
        $scope.$emit('selectedLetter', i);
        $scope.closeModal();
    };

    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.letters = [
        'А',
        'Б',
        'В',
        'Г',
        'Д',
        'Е',
        'Ж',
        'З',
        'И',
        'Й',
        'К',
        'Л',
        'М',
        'Н',
        'О',
        'П',
        'Р',
        'С',
        'Т',
        'У',
        'Ф',
        'Х',
        'Ц',
        'Ч',
        'Ш',
        'Щ',
        'Ъ',
        'Ы',
        'Ь',
        'Э',
        'Ю',
        'Я'
    ];
});