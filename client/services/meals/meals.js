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

              var meals = data.contents, completeMeals = _.filter(meals, {isComplete: true}),
              pendingMeals = _.filter(meals, {isComplete: false});
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

        function add(newMeal) {
            console.log('save args', arguments);
            console.log('SAVE _meals: ', _meals);
            var self = this, user = Auth.getUser();

            function successCB(response) {
              console.log('save successCB: ', response);
                self.addLocal(response);
            }

            function errCB(err) {
                console.log('save errCB: ', err);
                toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
            }


            $resource('/api/users/:userid/meals', {userid: user._id})
            .save(newMeal, _.bind(successCB, self), _.bind(errCB, self));

        }


        function addLocal(newMeal){
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
          var self = this,
          recipe = Recipes.getRecipe(id),
          mealObj = _.clone(recipe),
          ingredients = Cupboard.process(mealObj.ingredients);
          console.log('Ingredients for new meal', ingredients);

          mealObj = angular.extend(mealObj, {
            isComplete: false,
            ingredients: ingredients,
            sheduledDate: null,
            recipe: id
          });

          $q.when(ingredients, function(data){
            if(data.missing.length === 0){
              data.isComplete = true;
            }
          });


          return mealObj;
        }

        function create(id){
          var self = this, meal, ingredients;
          meal = self.createMealObject(id);

          $q.when(meal, function(ml){
            ingredients = ml.ingredients;
            $q.when(ingredients, function(ings){
              Cupboard.bulkRemove(ings.present);
              Shopping.bulkAdd(ings.missing);
              self.add(ml);
            });
          });

        }

        function remove(item){
          var self = this, userid;

          userid = Auth.getUser()._id;

          function CBSuccess(item) {
              console.log('removed cupboard item, removing locally', item);
              self.removeLocal(item);
          }

          function CBError(item) {
            self.toastr.error('could not remove '+ item.name + ' from cupboard');
          }

          self.$resource('/api/users/:userid/meals/:itemid', {
              userid: userid,
              itemid: item._id
          })
          .remove(_.bind(CBSuccess, self, item), _.bind(CBError, self, item));
        }

        function removeLocal(item){
          var self = this, cupboard;

          meals = self.getCupboard();
          self.$q.when(meals, function (data) {
            var items = data.contents;
            items.splice(items.indexOf(item), 1);
            self.toastr.success(item.ingredient.name + ' has been removed from your cupboard');
          });
        }

        init();

        return {
          init: init,
          get: get,
          add: add,
          addLocal: addLocal,
          remove: remove,
          removeLocal: removeLocal,
          create: create,
          createMealObject: createMealObject
        }

    }
}());
