(function () {
    'use strict';

    angular.module('utility')
        .filter('dashNothing', [function () {
            return function (input, alternateText) {
                alternateText = alternateText || '--';
                if (input) return input;
                return alternateText;
            };
        }]);
})();
