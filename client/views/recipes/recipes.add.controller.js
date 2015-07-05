'use strict';

angular.module('kitchenapp')
  .controller('RecipesAddCtrl', RecipesAddCtrl);

RecipesAddCtrl.$inject = ['$scope', 'Recipes', 'Ingredients', '$q'];


function RecipesAddCtrl($scope, Recipes, Ingredients, $q) {

	var vm = this,
	recipes,
	ingredients,
	rowTemplate,
	data = [];


	function saveRecipe(childScope){
		console.log(arguments);

		Recipes.save(vm.newRecipe);
		childScope.recipeForm.$setPristine();
		childScope.recipeForm.$setUntouched();
		vm.newRecipe = {};
	}

	ingredients = Ingredients.get();

	$q.when(ingredients, function(newData){
		vm.ingredients = newData;
	});


	angular.extend(vm, {
	  name: 'RecipesCtrl',
	  saveRecipe: saveRecipe
	});

}
