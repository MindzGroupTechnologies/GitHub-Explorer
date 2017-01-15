(function () {
    'use strict';

    angular.module('github')
        .provider('gitBase', function () {
            // default configuration
            var baseConfig = {
                method: 'GET',
                //params: gitCredentials
            };

            // git api base url
            var gitAPIHostUrl = 'https://api.github.com';

            this.$get = [function () {
                var oServiceInterface = {};

                oServiceInterface.build = function (config, token) {
                    // complete the url by suffixing the base url
                    config.url = gitAPIHostUrl + config.url;

                    // final configuration object
                    var buildConfig = {};

                    // copy all the configurations in final config object
                    $.extend(true, buildConfig, baseConfig, config);

                    if (token) {
                        buildConfig.headers = buildConfig.headers || {};
                        buildConfig.headers.Authorization = 'Bearer ' + token;
                    }
                    // return the final configuration object
                    return buildConfig;
                };

                return oServiceInterface;
            }];
        });
}());
