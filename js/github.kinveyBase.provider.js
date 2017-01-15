(function () {
    'use strict';

    angular.module('github')
        .provider('kinveyBase', function () {
            // default configuration
            var baseConfig = {
                method: 'POST'
            };

            // git api base url
            var kinveyAPIHostUrl = 'https://baas.kinvey.com/rpc/kid_rJQkM7uIx';

            this.$get = [function () {
                var oServiceInterface = {};
                var username = 'ghe';
                var password = 'Pass@word#123';

                baseConfig.headers = {};
                baseConfig.headers.Authorization = 'Basic ' + btoa(username + ":" + password);

                oServiceInterface.build = function (config) {
                    // complete the url by suffixing the base url
                    config.url = kinveyAPIHostUrl + config.url;

                    // final configuration object
                    var buildConfig = {};

                    // copy all the configurations in final config object
                    $.extend(true, buildConfig, baseConfig, config);

                    // return the final configuration object
                    return buildConfig;
                };

                return oServiceInterface;
            }];
        });
}());
