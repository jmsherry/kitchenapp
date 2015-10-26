(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('profile', {
        	url: '/profile',
          params: { messages : null },
          templateUrl: 'views/profile/profile.html',
          controller: 'ProfileCtrl',
          controllerAs: 'vm'
        });
    }]);
}());
