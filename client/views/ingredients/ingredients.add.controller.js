(function(){
'use strict';

angular.module('kitchenapp')
  .controller('IngredientsAddCtrl', IngredientsAddCtrl);

IngredientsAddCtrl.$inject = ['Ingredients', '$scope'];

function IngredientsAddCtrl(Ingredients, $scope) {
// console.log(stateMap);

	var vm = this, ingredients, data = [];


	function addIngredient(childScope){
		console.log(arguments);

		Ingredients.save(vm.newIngredient);

		childScope.ingredientForm.$setPristine();
		childScope.ingredientForm.$setUntouched();
		vm.newIngredient = {};

	}

	angular.extend(vm, {
	  addIngredient: addIngredient
	});


}

}());
