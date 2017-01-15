(function () {
    'use strict';

    angular.module('github')
        .provider('kinveyService', function () {
            this.$get = ['$http', 'kinveyBase', function ($http, kinveyBase) {
                var service = {};

                // search users
                service.getAuthCode = function (code) {
                    // build request
                    var request = kinveyBase.build({
                        url: '/custom/auth_github_explorer',
                        params: {
                            code: code
                        }
                    });

                    // execute the request
                    return $http(request);
                };

                return service;
            }];
        });
})();
