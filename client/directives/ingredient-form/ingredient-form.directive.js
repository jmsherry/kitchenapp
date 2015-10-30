(function(){
  'use strict';

  angular.module('kitchenapp.directives')
    .directive('editingredientform', function () {
      return {
        restrict: 'E',
        scope: {
          ingredients: "="
        },
        replace:true,
        templateUrl: 'directives/ingredient-form/ingredient-form.html'
      };
    });
}());
