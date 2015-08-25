(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('signup', {
        	url: '/signup',
          templateUrl: 'views/signup/signup.html',
          controller: 'SignupCtrl',
          controllerAs: 'vm'
        });
    });
}());
