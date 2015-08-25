(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('meals', {
        	url: '/meals',
          templateUrl: 'views/meals/meals.html',
          controller: 'MealsCtrl',
          controllerAs: 'vm'
        });
    });
}());
