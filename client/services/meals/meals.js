(function(){
'use strict';

angular.module('kitchenapp')
    .factory('Meals', Meals);

    Meals.$inject = ['$rootScope', '$cookieStore', '$q', '$resource', 'toastr', 'Auth', 'Recipes', 'Cupboard', 'Shopping', 'Ingredients'];

    function Meals($rootScope, $cookieStore, $q, $resource, toastr, Auth, Recipes, Cupboard, Shopping, Ingredients) {

        var $deferred = $q.defer(),
        _meals = $deferred.promise;

         function init() {
          console.log('meals init');

          var user = Auth.getUser();

            function successCB(MealsList){
              console.log('in successCB', arguments);

              var meals = MealsList.contents, completeMeals, pendingMeals;
              _.each(meals, function(meal){
                meal.ingredients.missing = Ingredients.populate(meal.ingredients.missing);
                meal.ingredients.present = Ingredients.populate(meal.ingredients.present);
              });
              completeMeals = _.filter(meals, {isComplete: true});
              pendingMeals = _.filter(meals, {isComplete: false});
              MealsList = {
                complete: completeMeals,
                pending: pendingMeals
              };
              $deferred.resolve(MealsList);
              console.log('meals service loaded.', _meals, MealsList);
            }

            function errCB(err){
              console.log('in errCB', arguments);
              $deferred.reject(err);
              toastr.error('Failed to load meals!', 'Server Error ' + err.status + ' ' + err.data.message);
            }

            $resource('/api/users/:userid/meals', {userid: user._id}).get(successCB, errCB);
         }

        function get() {
          console.log('GET', _meals);
          return _meals;
        }

        function add(newMeal) {
            console.log('save args', arguments);
            console.log('SAVE _meals: ', _meals);
            var self = this, user = Auth.getUser();

            $q.when(newMeal.ingredients, function(data){
              //newMeal.ingredients = data;


              function successCB(response) {
                console.log('addMeal save successCB: ', response);
                  response.ingredients.present = Ingredients.populate(response.ingredients.present);
                  response.ingredients.missing = Ingredients.populate(response.ingredients.missing);
                  Cupboard.bulkReserve(response.ingredients.present, response);
                  Shopping.bulkAdd(response.ingredients.missing, response);
                  self.addLocal(response);
              }

              function errCB(err) {
                  console.log('save errCB: ', err);
                  toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
              }


              $resource('/api/users/:userid/meals', {userid: user._id})
              .save(newMeal, _.bind(successCB, self), _.bind(errCB, self));

            });

        }


        function addLocal(newMeal){
          console.log('in add:', arguments);
          var meals = this.get(), ings;

          ings = newMeal.ingredients;

          ings.missing = Ingredients.populate(ings.missing);
          ings.present = Ingredients.populate(ings.present);

          $q.when(meals, function(meals){
            if(newMeal.isComplete){
              meals.complete.push(newMeal);
            } else {
              meals.pending.push(newMeal);
            }

            toastr.success(newMeal.name + " added!");
          });
        }

        function populate(idsArray){
          //if(idsArray.length === 0){return []};
          var populated = [], self = this, ings = self.get();

            $.each(idsArray, function(i, id){
              var ing = _.find(ings, {_id: id});
              populated.push(ing);
            });

          return populated;
        }

        // Turns a recipe id into a meal object
        function createMealObject(id){
          var self = this,
          deferred = $q.defer(),
          recipe = Recipes.getRecipe(id),
          mealObj = _.clone(recipe),
          ingredients = Cupboard.process(mealObj.ingredients);
          console.log('Ingredients for new meal', ingredients);

          $q.when(ingredients, function(data){

            mealObj = angular.extend(mealObj, {
              _id: undefined,
              isComplete: false,
              sheduledDate: null,
              ingredients:data,
              recipe: id
            });


            if(data.missing.length === 0){
              mealObj.isComplete = true;
            }

            deferred.resolve(mealObj);

          });

          return deferred.promise;

        }

        function create(id){
          var self = this, meal;
          meal = self.createMealObject(id);

          $q.when(meal, function(ml){
            $q.when(ml.ingredients, function(ings){
              ml.ings = ings;
              self.add(ml);
            });
          });

        }

        function update(meal){
          var self = this,
          userid = Auth.getUser()._id,
          mealid = meal._id;

          function successCB(meal, response) {
            console.log('update successCB: ', response);
              self.updateLocal(response);
          }

          function errCB(err) {
              console.log('update errCB: ', err);
              toastr.error('Failed to update ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
          }


          $resource('/api/users/:userid/meals/:mealid',
          {userid: userid, mealid:mealid},
          {update: { method: 'PUT'}})
          .update({meal: meal}, _.bind(successCB, self, meal), _.bind(errCB, self));
        }

        function updateLocal(meal){
          var self = this, meals;
          meals = self.get();
          $q.when(meals, function (mealData) {
            var oldMeal = _.find(mealData, {_id: meal._id});
            oldMeal = meal;
          });
        }

        function reCheckIngredients(){
          var self = this, cupboard, meals;
          meals = self.get();
          cupboard = Cupboard.get();
          $q.when(cupboard, function (cupboardData) {
            var items = cupboardData.contents; //Get cupboard items

            $q.when(meals, function (mealData) {
              var mls = mealData.pending; //Get pending meals
            _.forEach(mls, function(meal){

              var missing = meal.ingredients.missing, //Get missing ings from those meals
              i, changed = false, item, missingIng;

              for(i=0; i < missing.length; i+=1){

                missingIng = missing[i];
                item = _.find(items, function(item){
                  if(item.ingredient._id === missingIng._id){
                    return item;
                  }
                });

                if(item){
                  missing.splice(missing.indexOf(missingIng), 1);
                  meal.ingredients.present.push(missingIng);
                  changed = true;
                }

              }

              if(missing.length === 0){
                meal.isComplete = true;
              } else {
                meal.isComplete = false;
              }

              if(changed){
                self.update(meal);
              }

            });
          });

          });
        }


        function remove(item){
          var self = this, userid;

          Cupboard.bulkAdd(item.ingredients.present);
          Shopping.bulkRemove(item.ingredients.missing);

          userid = Auth.getUser()._id;

          function CBSuccess(item) {
              console.log('removed meal item, removing locally', item);
              self.removeLocal(item);
          }

          function CBError(item) {
            toastr.error('could not remove '+ item.name + ' from meals');
          }

          $resource('/api/users/:userid/meals/:itemid', {
              userid: userid,
              itemid: item._id
          })
          .remove(_.bind(CBSuccess, self, item), _.bind(CBError, self, item));
        }

        function removeLocal(meal){
          var self = this, meals;

          meals = self.get();
          $q.when(meals, function (data) {
            var items;

            if(meal.isComplete){
              items = data.complete;
            } else {
              items = data.pending;
            }

            items.splice(items.indexOf(meal), 1);
            toastr.success(meal.name + ' has been removed.');
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
          update: update,
          updateLocal: updateLocal,
          reCheckIngredients: reCheckIngredients,
          create: create,
          createMealObject: createMealObject,
          populate: populate
        };

    }
}());
