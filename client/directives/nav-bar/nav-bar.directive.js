(function(){
  'use strict';

  angular.module('kitchenapp')
    .directive('navBar', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/nav-bar/nav-bar.html'
      };
    });
}());
