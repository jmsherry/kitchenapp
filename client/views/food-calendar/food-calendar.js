(function () {
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('food-calendar', {
          url: '/food-calendar',
          params: {
            messages: null
          },
          templateUrl: 'views/food-calendar/food-calendar.html',
          controller: 'FoodCalendarCtrl',
          controllerAs: 'vm'
        });
    }]);
}());
