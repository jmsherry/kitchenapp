(function () {
  'use strict';

  //var thisYear = ;

  angular.module('kitchenapp.directives')
    .directive('kaFooter', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/footer/footer.html',
        link: function ($scope, element, attrs) {
          $scope.vm = {
            company: {
              name: 'HiveMind Web Development Ltd.',
              email: 'james.m.sherry@googlemail.com'
            },
            year: new Date().getFullYear()
          };
        },
      };
    });
 }());
