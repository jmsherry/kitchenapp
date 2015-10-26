(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('cupboard', {
        	url: '/cupboard',
          params: { messages : null },
          templateUrl: 'views/cupboard/cupboard.html',
          controller: 'CupboardCtrl',
          controllerAs: 'vm'
        });
    }]);
}());
