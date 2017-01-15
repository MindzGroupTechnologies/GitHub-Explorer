(function() {
    'use strict';

    angular.module('main')
        .controller('UserController', ['$scope', 'userInfo', function($scope, userInfo) {
            console.log('User Controller');

            $scope.userInfo = userInfo.data;
        }]);
}());
