'use strict';

angular.module('kitchenapp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('shop', {
      	url: '/shop',
        templateUrl: 'views/shop/shop.html',
        controller: 'ShopCtrl',
        controllerAs: 'vm'
      });
  });
