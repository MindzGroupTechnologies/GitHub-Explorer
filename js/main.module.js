(function () {
    'use strict';

    angular.module('main', ['ui.router', 'ui.bootstrap', 'ngStorage', 'github', 'angulartics.google.analytics', 'utility'])
        .config(['$stateProvider', '$analyticsProvider', 'pageProvider', function ($stateProvider, $analyticsProvider, pageProvider) {
            $analyticsProvider.withAutoBase(true);

            pageProvider.setSiteTitle('GitHub Explorer');

            $stateProvider.state('search', {
                url: '/Search',
                resolve: {
                    pageTitle: ['page', function (page) {
                        page.setPageTitle('Search');
                        console.log(page.getTitle());
                        return page.getTitle();
                    }]
                },
                views: {
                    '@': {
                        templateUrl: function () {
                            var url = 'Views/Search/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: 'SearchController'
                    }
                }
            }).state('user', {
                url: '/User/:login',
                resolve: {
                    userInfo: ['gitService', '$stateParams', function (gitService, $stateParams) {
                        return gitService.getUser($stateParams.login);
                    }],
                    pageTitle: ['page', function (page) {
                        page.setPageTitle('User');
                        return page.getTitle();
                    }]
                },
                views: {
                    '@': {
                        templateUrl: function () {
                            var url = 'Views/User/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: 'UserController'
                    }
                }
            }).state('user.repos', {
                url: '/Repositories',
                resolve: {
                    repositories: ['gitService', '$stateParams', function (gitService, $stateParams) {
                        return gitService.getUserRepositories($stateParams.login);
                    }],
                    pageTitle: ['page', function (page) {
                        page.setPageTitle('User Repositories');
                        return page.getTitle();
                    }]
                },
                views: {
                    'section@user': {
                        templateUrl: function () {
                            var url = 'Views/User/Repositories/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: ['$scope', 'repositories', function ($scope, repositories) {
                            console.log('Repositories Controller');
                            $scope.repositories = repositories.data;
                        }]
                    }
                }
            }).state('user.repos.branches', {
                url: '/:repo/Branches',
                resolve: {
                    branches: ['gitService', '$stateParams', function (gitService, $stateParams) {
                        return gitService.getUserRepositoryBranches($stateParams.login, $stateParams.repo);
                    }],
                    pageTitle: ['page', function (page) {
                        page.setPageTitle('Repository Branches');
                        return page.getTitle();
                    }]
                },
                views: {
                    'repo.detail@user.repos': {
                        templateUrl: function () {
                            var url = 'Views/User/Repositories/Detail/Branches/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: ['$scope', 'branches', '$stateParams', function ($scope, branches, $stateParams) {
                            console.log('Branches Controller');
                            $scope.branches = branches.data;
                            $scope.repositoryName = $stateParams.repo;
                        }]
                    }
                }
            }).state('user.repos.contributors', {
                url: '/:repo/Contributors',
                resolve: {
                    contributors: ['gitService', '$stateParams', function (gitService, $stateParams) {
                        return gitService.getUserRepositoryContributors($stateParams.login, $stateParams.repo);
                    }],
                    pageTitle: ['page', function (page) {
                        page.setPageTitle('Repository Contributors');
                        return page.getTitle();
                    }]
                },
                views: {
                    'repo.detail@user.repos': {
                        templateUrl: function () {
                            var url = 'Views/User/Repositories/Detail/Collaborators/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: ['$scope', 'contributors', '$stateParams', function ($scope, contributors, $stateParams) {
                            console.log('Contributors Controller');
                            $scope.contributors = contributors.data;
                            $scope.repositoryName = $stateParams.repo;
                        }]
                    }
                }
            }).state('user.orgs', {
                url: '/Organisations',
                resolve: {
                    pageTitle: ['page', function (page) {
                        page.setPageTitle('User Organisations');
                        return page.getTitle();
                    }]
                },
                views: {
                    'section@user': {
                        templateUrl: function () {
                            var url = 'Views/User/Organisations/';
                            console.log('loading template : ' + url);
                            return url;
                        }
                    }
                }
            }).state('user.gists', {
                url: '/Gists',
                resolve: {
                    gists: ['gitService', '$stateParams', function (gitService, $stateParams) {
                        return gitService.getUserGists($stateParams.login);
                    }],
                    pageTitle: ['page', function (page) {
                        page.setPageTitle('User Gists');
                        return page.getTitle();
                    }]
                },
                views: {
                    'section@user': {
                        templateUrl: function () {
                            var url = 'Views/User/Gists/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: ['$scope', 'gists', function ($scope, gists) {
                            console.log('Gists Controller');

                            var getGistInfo = function (gist) {
                                var fileKeys = Object.keys(gist.files);
                                var gistInfo = {};

                                gistInfo.name = fileKeys[0];
                                gistInfo.fileCount = fileKeys.length;

                                return gistInfo;
                            };

                            $scope.gists = gists.data;
                            $scope.getGistInfo = getGistInfo;
                        }]
                    }
                }
            }).state('user.gists.files', {
                url: '/:id/Files',
                params: {
                    gist: null
                },
                resolve: {
                    pageTitle: ['page', function (page) {
                        page.setPageTitle('Gists Files');
                        return page.getTitle();
                    }]
                },
                views: {
                    'gist.detail@user.gists': {
                        templateUrl: function () {
                            var url = 'Views/User/Gists/Detail/Info/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: ['$scope', '$stateParams', function ($scope, $stateParams) {
                            console.log('Files Controller');

                            $scope.gist = $stateParams.gist;
                        }]
                    }
                }
            })
        }])
        .run(['$state', function ($state) {
            $state.go('search');
        }]);
}());
