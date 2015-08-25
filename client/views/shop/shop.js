(function(){
  'use strict';

  angular.module('kitchenapp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('shop', {
        	url: '/shop',
          templateUrl: 'views/shop/shop.html',
          controller: 'ShopCtrl',
          controllerAs: 'vm'
        })
        .state('budget', {
          url: '/budget',
          templateUrl: 'views/shop/budget.html',
          controller: 'BudgetCtrl',
          controllerAs: 'vm'
        });
    });
}());
