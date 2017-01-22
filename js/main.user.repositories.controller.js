(function () {
    'use strict';

    angular.module('main')
        .controller('RepositoriesController', ['$scope', '$stateParams', 'gitService', function ($scope, $stateParams, gitService) {
            console.log('Repositories Controller');

            var repositories = null;
            var showPage = function (page) {
                if ($scope.totalItems > 0) {
                    var pageItems = [];
                    var startIndex = ((page - 1) * $scope.pageSize);
                    for (var i = startIndex; i < startIndex + $scope.pageSize; i++) {
                        repositories[i] && pageItems.push(repositories[i]);
                    }
                    $scope.repositories = pageItems;
                }
            }

            var loadRepositories = function () {
                gitService.getUserRepositories($stateParams.login)
                    .then(function (response) {
                        if (response.data.length > 0) {
                            repositories = response.data;
                            var totalItems = response.data.length;

                            $scope.totalItems = totalItems;
                            showPage($scope.currentPage)
                        } else {
                            $scope.repositories = null;
                        }
                    });
            }

            $scope.currentPage = 1;
            $scope.maxSize = 5;
            $scope.pageSize = 10;

            $scope.pageChanged = showPage;
            loadRepositories();
        }]);
}());
