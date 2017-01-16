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
