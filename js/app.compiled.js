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

(function () {
    'use strict';

    angular.module('main')
        .controller('HomeController', ['$scope', '$window', 'gitService', '$localStorage', '$state', function ($scope, $window, gitService, $localStorage, $state) {
            console.log("Home Controller");
            var messageListner = function (event) {
                if (event.data.access_token) {
                    debugger;
                    $localStorage.access_token = event.data.access_token;
                    $localStorage.scope = event.data.scope;
                    $localStorage.token_type = event.data.token_type;
                    userLoggedIn();
                }
            };

            var userLoggedIn = function () {
                gitService.getAuthenticatedUser()
                    .then(function (response) {
                        $scope.gitUserName = response.data.name;
                        $scope.user = response.data;
                    });
            }

            var logoutUser = function () {
                delete $localStorage.access_token;
                delete $localStorage.scope;
                delete $localStorage.token_type;
                delete $scope.user;
                delete $scope.gitUserName;
                $state.go('search');
            }

            var auth = function () {
                $window.open('https://github.com/login/oauth/authorize?client_id=492314afd654eaa0a8ed&scope=user%20repo');
                $window.removeEventListener("message", messageListner);
                $window.addEventListener("message", messageListner, false);
            };

            $scope.auth = auth;
            $scope.logoutUser = logoutUser;
            $localStorage.access_token && userLoggedIn();
            //$scope.gitUserName = "Anant Anand Gupta"
        }]);
}());

(function () {
    'use strict';

    angular.module('main')
        .controller('SearchController', ['$scope', 'gitService', function ($scope, gitService) {
            console.log("Search Controller");

            var search = function (currentPage) {
                gitService.searchUser($scope.searchValue, $scope.typeValue, currentPage, $scope.pageSize)
                    .then(function (response) {
                        if (response.data.items.length > 0) {
                            var items = response.data.items;
                            var totalItems = response.data.total_count;

                            $scope.searchResults = items;
                            $scope.totalItems = totalItems;
                        } else {
                            $scope.searchResults = null;
                        }
                    });
            }

            $scope.currentPage = 1;
            $scope.maxSize = 5;
            $scope.pageSize = 10

            $scope.searchValue = '';
            $scope.typeValue = 'user';
            $scope.search = search;
            $scope.pageChanged = search;
        }]);
}());

(function() {
    'use strict';

    angular.module('main')
        .controller('UserController', ['$scope', 'userInfo', function($scope, userInfo) {
            console.log('User Controller');

            $scope.userInfo = userInfo.data;
        }]);
}());
