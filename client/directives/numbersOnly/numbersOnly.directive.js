(function(){
  'use strict';

  angular.module('kitchenapp')
    .directive('numbersOnly', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {


         modelCtrl.$parsers.push(function (inputValue) {

           var transformedInput = inputValue.replace(/[^0-9\.]+/g, '');

           if (transformedInput !== inputValue) {
             modelCtrl.$setViewValue(transformedInput);
             modelCtrl.$render();
           }

           return transformedInput;
         });
        }
      };
    });
}());
