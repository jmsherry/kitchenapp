(function(){
  'use strict';

  angular.module('kitchenapp.directives')
    // .controller('ka-navbarCtrl', ['$log', '$state', '$scope', function($log, $state, $scope){
    //   $scope.vm = this;
    //   $scope.$watch($state.current.name, function(newValue, oldValue){
    //     $log.log('statechange: ', arguments);
    //     if(state === 'addIngredient' || state === 'ingredients'){
    //       $scope.vm.ingredientState = true;
    //     } else if(state === 'addRecipe' || state === 'recipes'){
    //       $scope.vm.recipeState = true;
    //     } else if(state === 'shopping' || state === 'budget'){
    //       $scope.vm.shoppingState = true;
    //     }
    //   });
    //
    // }])
    .directive('kaNavBar', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/nav-bar/nav-bar.html'//,
        //controller: 'ka-navbarCtrl as vm'
      };
    });
}());
