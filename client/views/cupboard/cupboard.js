(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('cupboard', {
        	url: '/cupboard',
          templateUrl: 'views/cupboard/cupboard.html',
          controller: 'CupboardCtrl',
          controllerAs: 'vm'
        });
    });
}());
