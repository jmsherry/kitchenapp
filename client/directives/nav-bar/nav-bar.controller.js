(function () {
  'use strict';

  angular.module('kitchenapp.directives')
    .controller('ka-navbarCtrl', ['$log', '$state', '$scope', 'Auth', '$rootScope', '$q', function ($log, $state, $scope, Auth, $rootScope, $q) {
      var vm = this, isLoggedIn;

      isLoggedIn = Auth.isLoggedIn();
      $q.when(isLoggedIn, function(res){
        vm.isLoggedIn = res;
      });

      $rootScope.$on('login', function (mass) {
        vm.isLoggedIn = true;
      });
      $rootScope.$on('logout', function (mass) {
        vm.isLoggedIn = false;
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
