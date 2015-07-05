'use strict';

angular.module('kitchenapp')
  .directive('addRecipeForm', function () {
    return {
      restrict: 'E',
      replace:true,
      templateUrl: 'directives/recipe-form/recipe-form.html'
    };
  });
