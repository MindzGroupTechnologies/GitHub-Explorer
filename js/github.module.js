(function () {
    'use strict';

    angular.module('github', ['ui.router', 'ngStorage'])
        .config(['$locationProvider', '$stateProvider', function ($locationProvider, $stateProvider) {
            // enable restful urls in the browser address bar
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true,
                rewriteLinks: true
            });
        }]);
}());
