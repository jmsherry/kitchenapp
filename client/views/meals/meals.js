(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('meals', {
        	url: '/meals',
          params: { messages : null },
          templateUrl: 'views/meals/meals.html',
          controller: 'MealsCtrl',
          controllerAs: 'vm'
        });
    }]);
}());
