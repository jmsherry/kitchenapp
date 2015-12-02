(function(){
  'use strict';

  angular.module('kitchenapp.directives')
  .controller('KaRecipeFormCtrl', ['$scope', '$q', '$log', '$modal', 'Email', 'Auth', 'toastr', function ($scope, $q, $log, $modal, Email, Auth, toastr) {
    var vm = this;
    $scope.$watch('ingredients', function(newValue){
      vm.ingredients = newValue;
    });
    // vm.title = title;
    // vm.ingredients = ingredients;
    angular.extend(vm, {
      name: 'KaRecipeFormCtrl'
    });
  }])
    .directive('kaAddRecipeForm', function () {
      return {
        restrict: 'E',
        require: '^IngredientsAddCtrl',
        scope: {
          ingredients: "=",
          title: "@"
        },
        replace:true,
        templateUrl: 'directives/recipe-form/recipe-form.html',
        controller: 'KaRecipeFormCtrl as vm',
        bindToController: true
      };
    });
}());
