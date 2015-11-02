(function(){
  'use strict';

  angular.module('kitchenapp.directives')
  .controller('KaIngredientFormCtrl', ['$scope', '$q', '$log', '$modal', 'Email', 'Auth', 'toastr', function ($scope, $q, $log, $modal, Email, Auth, toastr) {
    var vm = this;
    angular.extend(vm, {
      name: 'KaIngredientFormCtrl',
      ingredients: $scope.ingredients,
      title: $scope.title
    });
  }])
    .directive('editingredientform', function () {
      return {
        restrict: 'E',
        require: '^IngredientsAddCtrl',
        scope: {
          ingredients: "=",
          title: "@"
        },
        replace:true,
        templateUrl: 'directives/ingredient-form/ingredient-form.html',
        controller: 'KaIngredientFormCtrl as vm',
        bindToController: true
      };
    });
}());
