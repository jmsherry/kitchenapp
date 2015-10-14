(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('login', {
        	url: '/login',
          templateUrl: 'views/login/login.html',
          controller: 'LoginCtrl',
          controllerAs: 'vm'
        });
    }]);
}());
