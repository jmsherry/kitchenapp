(function () {

  'use strict';

  angular.module('kitchenapp')
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider
        .state('ingredients', {
          url: '/ingredients',
          params: { messages : null },
          templateUrl: 'views/ingredients/ingredients.list.html',
          controller: 'IngredientsCtrl',
          controllerAs: 'vm'
        })
        .state('addIngredient', {
          url: '/ingredient/add',
          params: { messages : null },
          templateUrl: 'views/ingredients/ingredients.add.html',
          controller: 'IngredientsAddCtrl',
          controllerAs: 'vm'
        });
    }]);

}());
