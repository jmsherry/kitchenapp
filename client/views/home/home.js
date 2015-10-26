(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('home', {
        	url: '/',
          templateUrl: 'views/home/home.html',
          params: { messages : null },
          controller: 'HomeCtrl',
          controllerAs: 'vm'
        });
    }]);
}());
