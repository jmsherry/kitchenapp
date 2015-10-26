(function(){
  'use strict';

  angular.module('kitchenapp.directives')
  .controller('KaRecipeFormCtrl', ['$scope', '$q', '$log', '$modal', 'Email', 'Auth', 'toastr', function ($scope, $q, $log, $modal, Email, Auth, toastr) {
    var vm = this;
    vm.name = 'KaRecipeFormCtrl';
  }])
    .directive('addRecipeForm', function () {
      return {
        restrict: 'E',
        scope: {
          ingredients: "="
        },
        replace:true,
        templateUrl: 'directives/recipe-form/recipe-form.html',
        controller: 'KaRecipeFormCtrl as vm',
        bindToController: true
      };
    });
}());
