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
