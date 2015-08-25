(function(){

  'use strict';

  angular.module('kitchenapp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('ingredients', {
        	url: '/ingredients',
          templateUrl: 'views/ingredients/ingredients.list.html',
          controller: 'IngredientsCtrl',
          controllerAs: 'vm'
        })
        .state('addIngredient', {
        	url: '/ingredient/add',
          templateUrl: 'views/ingredients/ingredients.add.html',
          controller: 'IngredientsAddCtrl',
          controllerAs: 'vm'
        })
    });

}());
