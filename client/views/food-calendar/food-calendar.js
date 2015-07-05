'use strict';

angular.module('kitchenapp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('food-calendar', {
      	url: '/food-calendar',
        templateUrl: 'views/food-calendar/food-calendar.html',
        controller: 'FoodCalendarCtrl',
        controllerAs: 'vm'
      });
  });
