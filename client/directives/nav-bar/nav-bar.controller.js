(function () {
  'use strict';

  angular.module('kitchenapp.directives')
    .controller('ka-navbarCtrl', ['$log', '$state', '$scope', 'Auth', '$rootScope', function ($log, $state, $scope, Auth, $rootScope) {
      var vm = this;

      vm.isLogged = Auth.isLogged();
      $scope.$on('login', function (mass) {
        vm.isLogged = true
      });
      $scope.$on('logout', function (mass) {
        vm.isLogged = false
      });

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $log.log('statechange: ', arguments);
        var newStateName = toState.name;
        if (newStateName === 'addIngredient' || newStateName === 'ingredients') {
          vm.ingredientState = true;
          vm.recipeState = false;
          vm.shoppingState = false;
        } else if (newStateName === 'addRecipe' || newStateName === 'recipes') {
          vm.ingredientState = false;
          vm.recipeState = true;
          vm.shoppingState = false;
        } else if (newStateName === 'shop' || newStateName === 'budget') {
          vm.ingredientState = false;
          vm.recipeState = false;
          vm.shoppingState = true;
        }
      });

    }]);
}());
