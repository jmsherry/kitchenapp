(function () {
  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('recipes', {
          url: '/recipes',
          params: { messages : null },
          templateUrl: 'views/recipes/recipes.list.html',
          controller: 'RecipesCtrl',
          controllerAs: 'vm'
        })
        .state('addRecipe', {
          url: '/recipes/add',
          params: { messages : null },
          templateUrl: 'views/recipes/recipes.add.html',
          controller: 'RecipesAddCtrl',
          controllerAs: 'vm'
        });
    }]);

}());
