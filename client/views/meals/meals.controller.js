'use strict';

angular.module('kitchenapp')
  .controller('MealsCtrl', MealsCtrl);

MealsCtrl.$inject = ['$scope', 'Meals', 'Auth', 'Recipes', '$modal', '$window', '$q'];

  function MealsCtrl($scope, Meals, Auth, Recipes, $modal, $window, $q) {

  	Auth.checkAuthorised();

    var vm = this,
    user = Auth.getUser(),
    meals = Meals.get(),
    recipes = Recipes.get(),
    chosenRecipe = "";

    console.log('meals', meals);
    //	console.log(recipes);

    $q.when(recipes, function(data){
    	vm.recipes = data;
    });

    $q.when(meals, function(data){
      vm.completeMeals = data.complete;
      vm.pendingMeals = data.pending;
    });


    function createMeal(){
      console.log(vm.chosenRecipe);
    	Meals.create(vm.chosenRecipe);
    	vm.chosenRecipe = "";
    }

    function removeMeal(id){
      console.log('removeMeal', id);
      Meals.remove(id);
    }


    angular.extend(vm, {
      name: 'MealsCtrl',
      createMeal: createMeal,
      removeMeal: removeMeal,
      recipes: recipes,
      chosenRecipe: chosenRecipe
    });

  }
