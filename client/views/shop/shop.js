(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('shop', {
        	url: '/shop',
          params: { messages : null },
          templateUrl: 'views/shop/shop.html',
          controller: 'ShopCtrl',
          controllerAs: 'vm'
        })
        .state('budget', {
          url: '/budget',
          params: { messages : null },
          templateUrl: 'views/shop/budget.html',
          controller: 'BudgetCtrl',
          controllerAs: 'vm'
        });
    }]);
}());
