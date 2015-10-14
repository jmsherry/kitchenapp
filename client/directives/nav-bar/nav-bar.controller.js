(function(){
  'use strict';

  angular.module('kitchenapp.directives')
    .controller('ka-navbarCtrl', ['$log', '$state', '$scope', 'Auth', function($log, $state, $scope, Auth){
      var vm = this;
      vm.isLogged = Auth.isLogged();
      $scope.$watch($state.current.name, function(newValue, oldValue){
        $log.log('statechange: ', arguments);
        if(newValue === 'addIngredient' || newValue === 'ingredients'){
          vm.ingredientState = true;
          vm.recipeState = false;
          vm.shoppingState = false;
        } else if(newValue === 'addRecipe' || newValue === 'recipes'){
          vm.ingredientState = false;
          vm.recipeState = true;
          vm.shoppingState = false;
        } else if(newValue === 'shopping' || newValue === 'budget'){
          vm.ingredientState = false;
          vm.recipeState = false;
          vm.shoppingState = true;
        }
      });

    }]);
}());
