(function () {
    'use strict';

    angular.module('github')
        .controller('AuthController', ['$scope', 'kinveyService', '$location', '$window', function ($scope, kinveyService, $location, $window) {
            console.log('Auth Controller');

            var code = $location.search().code;

            $scope.message = 'Authenticating';
            if (code) {
                kinveyService.getAuthCode(code)
                    .then(function(response) {
                        $window.opener.postMessage(response.data, $location.protocol() + '://' + $location.host());
                        $window.close();
                    });
            }
        }]);
}());
