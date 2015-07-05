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
    chosenRecipe;

    console.log('meals', meals);
    //	console.log(recipes);

    $q.when(recipes, function(newData){
    	vm.recipes = newData;
    });


    function createMeal(){
    	Meals.create(vm.chosenRecipe);
    	vm.chosenRecipe = "";
    }


    angular.extend(vm, {
      name: 'MealsCtrl',
      createMeal: createMeal,
      recipes: recipes,
      completeMeals: meals.complete,
      pendingMeals: meals.pending,
      chosenRecipe: chosenRecipe
    });

  }
