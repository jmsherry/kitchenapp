(function () {
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('recipes', {
          abstract: true,
          template: '<ui-view/>'
        })
        .state('recipes.list', {
          url: '/recipes',
          templateUrl: 'views/recipes/recipes.list.html',
          controller: 'RecipesCtrl',
          controllerAs: 'vm'
        })
        .state('recipes.add', {
          url: '/recipes/add',
          templateUrl: 'views/recipes/recipes.add.html',
          controller: 'RecipesAddCtrl',
          controllerAs: 'vm'
        });
    }]);

}());
