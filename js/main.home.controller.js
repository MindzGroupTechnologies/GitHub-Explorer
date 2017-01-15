(function () {
    'use strict';

    angular.module('main')
        .controller('HomeController', ['$scope', '$window', 'gitService', '$localStorage', function ($scope, $window, gitService, $localStorage) {
            console.log("Home Controller");
            var messageListner = function (event) {
                if(event.data.access_token) {
                    debugger;
                    $localStorage.access_token = event.data.access_token;
                    $localStorage.scope = event.data.scope;
                    $localStorage.token_type = event.data.token_type;
                    userLoggedIn();
                }
            };
            var userLoggedIn = function() {
                gitService.getAuthenticatedUser()
                    .then(function(response) {
                        $scope.gitUserName = response.data.name;
                        $scope.user = response.data;
                        $localStorage.user = response.data;
                    });
            }
            var auth = function () {
                $window.open('https://github.com/login/oauth/authorize?client_id=492314afd654eaa0a8ed&scope=user%20repo');
                $window.removeEventListener("message", messageListner);
                $window.addEventListener("message", messageListner, false);
            };

            $scope.auth = auth;
            userLoggedIn();
            //$scope.gitUserName = "Anant Anand Gupta"
        }]);
}());
