'use strict';

angular.module('kitchenapp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recipes', {
      	url: '/recipes',
        templateUrl: 'views/recipes/recipes.list.html',
        controller: 'RecipesCtrl',
        controllerAs: 'vm'
      })
      .state('addRecipe', {
      	url: '/recipe/add',
        templateUrl: 'views/recipes/recipes.add.html',
        controller: 'RecipesAddCtrl',
        controllerAs: 'vm'
      });
  });
