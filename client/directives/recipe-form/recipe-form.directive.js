(function(){
  'use strict';

  angular.module('kitchenapp.directives')
  .controller('KaRecipeFormCtrl', ['$scope', '$q', '$log', '$modal', 'Email', 'Auth', 'toastr', function ($scope, $q, $log, $modal, Email, Auth, toastr) {
    var vm = this;
    $scope.$watch('ingredients', function(newValue){
      vm.ingredients = newValue;
    });
    angular.extend(vm, {
      name: 'KaRecipeFormCtrl',
      ingredients: $scope.ingredients,
      title: $scope.title
    });
  }])
    .directive('addRecipeForm', function () {
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
