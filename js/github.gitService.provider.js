(function () {
    'use strict';

    angular.module('github')
        .provider('gitService', function () {
            this.$get = ['$http', 'gitBase', '$localStorage', function ($http, gitBase, $localStorage) {
                var service = {};

                // search users
                service.searchUser = function (login, type, page, pageSize) {
                    type = type || 'org';
                    page = page || 1;
                    pageSize = pageSize || 10;

                    // build request
                    var request = gitBase.build({
                        url: '/search/users',
                        params: {
                            q: login + ' type:' + type,
                            page: page,
                            per_page: pageSize
                        }
                    }, $localStorage.access_token);

                    // execute the request
                    return $http(request);
                };

                service.getAuthenticatedUser = function () {
                    // build request
                    var request = gitBase.build({
                        url: '/user',
                        method: 'GET'
                    }, $localStorage.access_token);

                    // execute the request
                    return $http(request);
                }

                service.getUser = function (login) {
                    // build request
                    var request = gitBase.build({
                        url: '/users/' + login,
                        method: 'GET'
                    }, $localStorage.access_token);

                    // execute the request
                    return $http(request);
                }

                service.getUserRepositories = function (login) {
                    // build request
                    var request = gitBase.build({
                        url: '/users/' + login + '/repos',
                        method: 'GET'
                    }, $localStorage.access_token);

                    // execute the request
                    return $http(request);
                }

                service.getUserRepositoryBranches = function (login, repo) {
                    // build request
                    var request = gitBase.build({
                        url: '/repos/' + login + '/' + repo + '/branches',
                        method: 'GET'
                    }, $localStorage.access_token);

                    // execute the request
                    return $http(request);
                }

                service.getUserRepositoryContributors = function (login, repo) {
                    // build request
                    var request = gitBase.build({
                        url: '/repos/' + login + '/' + repo + '/contributors',
                        method: 'GET'
                    }, $localStorage.access_token);

                    // execute the request
                    return $http(request);
                }

                return service;
            }];
        });
})();
