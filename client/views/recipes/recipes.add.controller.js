(function(){
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('RecipesAddCtrl', RecipesAddCtrl);

  RecipesAddCtrl.$inject = ['$scope', 'Recipes', 'Ingredients', '$q', '$log'];


  function RecipesAddCtrl($scope, Recipes, Ingredients, $q, $log) {

  	var vm = this, $ingredients = Ingredients.get();

    $q.when($ingredients, function(ingredients){
      vm.ingredients = ingredients;
    });

    function saveRecipe(childScope){
      $log.log('saveRecipe', arguments);

      Recipes.save(vm.newRecipe);
      childScope.recipeForm.$setPristine();
      childScope.recipeForm.$setUntouched();
      vm.newRecipe = {};
    }


  	angular.extend(vm, {
  	  name: 'RecipesCtrl',
  	  saveRecipe: saveRecipe
  	});

  }
}());
