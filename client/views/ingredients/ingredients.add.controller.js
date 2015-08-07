(function(){
'use strict';

angular.module('kitchenapp')
  .controller('IngredientsAddCtrl', IngredientsAddCtrl);

IngredientsAddCtrl.$inject = ['Ingredients', '$scope'];

function IngredientsAddCtrl(Ingredients, $scope) {
// console.log(stateMap);

	var vm = this, ingredients, data = [];

  function handlePrice(){
    console.log('handlePrice');

    var price, pounds = vm.newIngredient.pounds, pence = vm.newIngredient.pence;

    if(!pounds){
      pounds = 0;
    }
    if(!pence){
      pence = 0;
    }

    price = parseFloat(pounds + pence/100);

    vm.newIngredient.price = price.toFixed(2) * 1;
  }


	function addIngredient(childScope){
		console.log(arguments);

    var newIng = vm.newIngredient;

		Ingredients.save(newIng);

		childScope.ingredientForm.$setPristine();
		childScope.ingredientForm.$setUntouched();
		vm.newIngredient = {};

	}

	angular.extend(vm, {
	  addIngredient: addIngredient,
    handlePrice: handlePrice,
    newIngredient: {}
	});


}

}());
