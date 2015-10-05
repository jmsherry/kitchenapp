(function(){
  'use strict';

  angular.module('kitchenapp.directives')
    .directive('kaNavBar', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/nav-bar/nav-bar.html'
      };
    });
}());
