(function() {
    'use strict';

    angular.module('utility', []);
}());

(function () {
    'use strict';

    angular.module('utility')
        .provider('page', function () {
            var pageTitle = 'Home';
            var siteTitle = 'MySite';
            var pageTitleOnly = false;

            var setSiteTitle = function (newTitle) {
                siteTitle = newTitle;
            }

            var setPageTitle = function (newTitle) {
                pageTitle = newTitle;
            }

            this.setSiteTitle = setSiteTitle;
            this.setPageTitle = setPageTitle;
            this.pageTitleOnly = pageTitleOnly;

            this.$get = [function () {
                var oServiceInterface = {};

                oServiceInterface.setPageTitle = setPageTitle;
                oServiceInterface.getTitle = function() {
                    if(pageTitleOnly) {
                        return pageTitle;
                    } else {
                        return siteTitle + ' - ' + pageTitle;
                    }
                }

                return oServiceInterface;
            }];
        });
}());

(function () {
    'use strict';

    angular.module('utility')
        .filter('dashNothing', [function () {
            return function (input, alternateText) {
                alternateText = alternateText || '--';
                if (input) return input;
                return alternateText;
            };
        }]);
})();

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

                service.getUserGists = function (login) {
                    // build request
                    var request = gitBase.build({
                        url: '/users/' + login + '/gists',
                        method: 'GET'
                    }, $localStorage.access_token);

                    // execute the request
                    return $http(request);
                }

                service.getUserOrganisations = function (login) {
                    // build request
                    var request = gitBase.build({
                        url: '/users/' + login + '/orgs',
                        method: 'GET'
                    }, $localStorage.access_token);

                    // execute the request
                    return $http(request);
                }

                service.getMyOrganisations = function () {
                    // build request
                    var request = gitBase.build({
                        url: '/user/orgs',
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
                        },
                        controller: ['$scope', 'gitService', '$stateParams', function ($scope, gitService, $stateParams) {
                            console.log('Organisations Controller');
                            this.getOrgs = function () {
                                if ($stateParams.login === $scope.user.login) {
                                    return gitService.getMyOrganisations();
                                } else {
                                    return gitService.getUserOrganisations($stateParams.login);
                                }
                            };

                            this.getOrgs().then(function (response) {
                                $scope.organisations = response.data;
                            });
                        }]
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

            var navMain = $("#main-nav");
            navMain.on("click", "a", null, function () {
                navMain.collapse('hide');
            });

        }]);
}());

(function () {
    'use strict';

    angular.module('main')
        .controller('HomeController', ['$scope', '$window', 'gitService', '$localStorage', '$state', 'page', function ($scope, $window, gitService, $localStorage, $state, page) {
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
                        $state.go('user', {login : response.data.login});
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
                $window.open('https://github.com/login/oauth/authorize?client_id=492314afd654eaa0a8ed&scope=user%20repo%20read:org');
                $window.removeEventListener("message", messageListner);
                $window.addEventListener("message", messageListner, false);
            };

            $scope.auth = auth;
            $scope.logoutUser = logoutUser;
            $localStorage.access_token && userLoggedIn();
            $scope.page = page;
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
