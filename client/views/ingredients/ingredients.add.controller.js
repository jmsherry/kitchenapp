(function(){
'use strict';

angular.module('kitchenapp.controllers')
  .controller('IngredientsAddCtrl', IngredientsAddCtrl);

IngredientsAddCtrl.$inject = ['Ingredients', '$scope', '$q'];

function IngredientsAddCtrl(Ingredients, $scope, $q) {
// console.log(stateMap);

	var vm = this, $ingredients = Ingredients.get();

  $q.when($ingredients, function(ingredients){
    vm.ingredients = ingredients || [];
  });


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
