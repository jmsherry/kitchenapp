(function(){
'use strict';

angular.module('kitchenapp')
    .factory('Meals', Meals);

    Meals.$inject = ['$rootScope', '$cookieStore', '$q', '$resource', 'toastr', 'Auth', 'Recipes', 'Cupboard', 'Shopping'];

    function Meals($rootScope, $cookieStore, $q, $resource, toastr, Auth, Recipes, Cupboard, Shopping) {

        var _meals = {
          complete: [],
          pending: []
        };

         function init() {
          console.log('firing init');
          var $deferred = $q.defer(),
          user = Auth.getUser();

          _meals = $deferred.promise

            function successCB(data){
              console.log('in successCB', arguments);
              var completeMeals = _.filter(data, {isComplete: true}),
              pendingMeals = _.filter(data, {isComplete: false});
              data = {
                complete: completeMeals,
                pending: pendingMeals
              };
              $deferred.resolve(data);
              console.log('meals service loaded.', _meals, data);
            }

            function errCB(err){
              console.log('in errCB', arguments);
              $deferred.reject(err);
              toastr.error('Failed to load meals!', 'Server Error ' + err.status + ' ' + err.data.message);
            }

            $resource('/api/users/:userid/meals', {userid: user._id}).query(successCB, errCB);
         }

        function get() {
          console.log('GET', _meals);
          return _meals;
        }

        //persists to server
        function save(newMeal) {
            console.log('save args', arguments);
            console.log('SAVE _meals: ', _meals);
            var self = this;

            function successCB(response) {
              console.log('save successCB: ', response);
                self.add(response.meal);
            }

            function errCB(err) {
                console.log('save errCB: ', err);
                toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
            }


            $resource.save('/api/users/:userid/meals', newMeal, _.bind(successCB, self), _.bind(errCB, self));

        }

        //adds a meal to the users meals array
        function add(newMeal){
          console.log('in add:', arguments);
          var meals = this.get();

          $q.when(meals, function(meals){
            if(newMeal.isComplete){
              meals.complete.push(newMeal);
            } else {
              meals.pending.push(newMeal);
            }

            toastr.success(newMeal.name + " added!");
          });
        }

        // Turns a recipe id into a meal object
        function createMealObject(id){
          var recipe = Recipes.getRecipe(id),
          mealObj = Object.create(recipe),
          ingredients = Cupboard.process(mealObj.ingredients);
          console.log('Ingredients for new meal', ingredients);

          mealObj = angular.extend(mealObj, {
            id: null,
            isComplete: false,
            ingredients: ingredients,
            sheduledDate: null,
            recipe: id
          });

          if(mealObj.ingredients.missing.length === 0){
            mealObj.isComplete = true;
          }

          return mealObj;
        }

        function create(id){
          var self = this, meal, ingredients;
          meal = self.createMealObject(id),
          ingredients = meal.ingredients;
          Cupboard.remove(ingredients.present);
          Shopping.add(ingredients.missing);
          self.save(meal);
        }

        init();

        return {
          init: init,
          get: get,
          add: add,
          save: save,
          create: create,
          createMealObject: createMealObject
        }

    }
}());
