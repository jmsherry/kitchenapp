'use strict';

angular.module('kitchenapp')
  .controller('MealsCtrl', MealsCtrl);

MealsCtrl.$inject = ['$scope', 'Meals', 'Auth', 'Recipes', '$modal', '$window', '$q', '$log'];

  function MealsCtrl($scope, Meals, Auth, Recipes, $modal, $window, $q, $log) {

  	Auth.checkAuthorised();

    var vm = this,
    user = Auth.getUser(),
    meals = Meals.get(),
    recipes = Recipes.get(),
    chosenRecipe = "";


    $q.when(recipes, function(data){
      $log.log('recipes', data);
    	vm.recipes = data;
    });

    $q.when(meals, function(data){
      $log.log('meals', data);
      vm.completeMeals = data.complete;
      vm.pendingMeals = data.pending;
    });


    function createMeal(){
      $log.log(vm.chosenRecipe);
    	Meals.create(vm.chosenRecipe);
    	vm.chosenRecipe = "";
    }

    function removeMeal(meal){
      $log.log('removeMeal', meal);
      Meals.remove(meal);
    }

    function placeMeal(meal){
      $log.log('placeMeal', meal);
    }


    angular.extend(vm, {
      name: 'MealsCtrl',
      createMeal: createMeal,
      removeMeal: removeMeal,
      placeMeal: placeMeal,
      recipes: recipes,
      chosenRecipe: chosenRecipe
    });

  }
