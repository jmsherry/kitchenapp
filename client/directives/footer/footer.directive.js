(function () {
  'use strict';

  //var thisYear = ;

  angular.module('kitchenapp.directives')
    .controller('KaFooterCtrl', function($scope, $log){
      var vm = this;
      vm.year = new Date().getFullYear();
    })
    .directive('kaFooter', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/footer/footer.html',
        scope: {
          companyName: '@',
          companyEmail: '@'
        },
        controller: 'KaFooterCtrl as vm',
        bindToController: true
      };
    });
}());
