(function () {
    'use strict';

    angular.module('main', ['ui.router', 'ui.bootstrap', 'ngStorage', 'github'])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('search', {
                url: '/Search',
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
                    }]
                },
                views: {
                    'section@user': {
                        templateUrl: function () {
                            var url = 'Views/User/Repositories/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: ['$scope', 'repositories', function($scope, repositories) {
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
                    }]
                },
                views: {
                    'repo.detail@user.repos': {
                        templateUrl: function () {
                            var url = 'Views/User/Repositories/Detail/Branches/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: ['$scope', 'branches', function($scope, branches) {
                            console.log('Branches Controller');
                            $scope.branches = branches.data;
                        }]
                    }
                }
            }).state('user.repos.contributors', {
                url: '/:repo/Contributors',
                resolve: {
                    contributors: ['gitService', '$stateParams', function (gitService, $stateParams) {
                        return gitService.getUserRepositoryContributors($stateParams.login, $stateParams.repo);
                    }]
                },
                views: {
                    'repo.detail@user.repos': {
                        templateUrl: function () {
                            var url = 'Views/User/Repositories/Detail/Collaborators/';
                            console.log('loading template : ' + url);
                            return url;
                        },
                        controller: ['$scope', 'contributors', function($scope, contributors) {
                            console.log('Contributors Controller');
                            $scope.contributors = contributors.data;
                        }]
                    }
                }
            }).state('user.orgs', {
                url: '/Organisations',
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
                views: {
                    'section@user': {
                        templateUrl: function () {
                            var url = 'Views/User/Gists/';
                            console.log('loading template : ' + url);
                            return url;
                        }
                    }
                }
            })
        }])
        .run(['$state', function ($state) {
            $state.go('search');
        }]);
}());
