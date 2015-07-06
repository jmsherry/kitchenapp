(function(){
'use strict';

angular.module('kitchenapp')
    .factory('Meals', Meals);

    Meals.$inject = ['$rootScope', '$cookieStore', '$q', '$http', '$resource', 'toastr', 'Recipes', 'Cupboard', 'Shopping'];

    function Meals($rootScope, $cookieStore, $q, $http, $resource, toastr, Recipes, Cupboard, Shopping) {

        var _meals = {
          complete: [],
          pending: []
        },
        _resource = $resource('/api/meals');

         function init() {
          console.log('firing init');
          var $deferred = $q.defer();
          _meals = $deferred.promise;

            function successCB(data){
              console.log('in successCB', arguments);
              $deferred.resolve(data);
              console.log('meals service loaded.', _meals, data);
            }

            function errCB(err){
              console.log('in errCB', arguments);
              $deferred.reject(err);
              toastr.error('Failed to load meals!', 'Server Error ' + err.status + ' ' + err.data.message);
            }

            _meals.then(function(data){
              console.log('in meals then', arguments);
              console.log('_meals before', _meals);
              var completeMeals = _.filter(data, {isComplete: true}),
              pendingMeals = _.filter(data, {isComplete: false});
              _meals.complete = completeMeals;
              _meals.pending = pendingMeals;
              console.log('_meals after', _meals);
            });

            _resource.query(successCB, errCB);
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


            _resource.save(newMeal, _.bind(successCB, self), _.bind(errCB, self));

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
          var recipe = Recipes.getRecipe(id);
          var mealObj = _.clone(recipe);

          mealObj._id = null;
          mealObj.isComplete = false;
          mealObj.ingredients = Cupboard.process(mealObj.ingredients);
          mealObj.sheduledDate = null;
          mealObj.recipe = id;

          if(mealObj.ingredients.missing.length === 0){
            mealObj.isComplete = true;
          }

          return mealObj;
        }

        function create(id){
          var self = this, meal, ingredients;
          meal = self.createMealObject(id),
          ingredients = meal.ingredients;
          Cupboard.bulkRemove(ingredients.present);
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
