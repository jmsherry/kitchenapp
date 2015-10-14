(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('profile', {
        	url: '/profile',
          templateUrl: 'views/profile/profile.html',
          controller: 'ProfileCtrl',
          controllerAs: 'vm'
        });
    }]);
}());
