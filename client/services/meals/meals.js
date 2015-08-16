(function(){
'use strict';

angular.module('kitchenapp')
    .factory('Meals', Meals);

    Meals.$inject = ['$rootScope', '$cookieStore', '$q', '$log', '$resource', 'toastr', 'Auth', 'Recipes', 'Cupboard', 'Shopping', 'Ingredients'];

    function Meals($rootScope, $cookieStore, $q, $log, $resource, toastr, Auth, Recipes, Cupboard, Shopping, Ingredients) {

        var $deferred = $q.defer(),
        _meals = $deferred.promise;

         function init() {
          $log.log('meals init');

          var user = Auth.getUser();

            function successCB(meals){
              $log.log('in successCB', arguments);

              var completeMeals, pendingMeals;
              _.each(meals, function(meal){
                meal.ingredients.missing = Ingredients.populate(meal.ingredients.missing);
                meal.ingredients.present = Ingredients.populate(meal.ingredients.present);
              });
              completeMeals = _.filter(meals, {isComplete: true});
              pendingMeals = _.filter(meals, {isComplete: false});
              meals = {
                complete: completeMeals,
                pending: pendingMeals
              };
              $deferred.resolve(meals);
              $log.log('meals service loaded.', meals);
            }

            function errCB(err){
              $log.log('in errCB', arguments);
              $deferred.reject(err);
              toastr.error('Failed to load meals!', 'Server Error ' + err.status + ' ' + err.data.message);
            }

            $resource('/api/users/:userid/meals', {userid: user._id}).query(successCB, errCB);
         }

        function get() {
          //$log.log('GET', _meals);
          return _meals;
        }

        function add(newMeal) {
            $log.log('save args', arguments);
            $log.log('SAVE _meals: ', _meals);
            var self = this, user = Auth.getUser();

            $q.when(newMeal.ingredients, function(data){
              //newMeal.ingredients = data;


              function successCB(response) {
                $log.log('addMeal save successCB: ', response);
                response.ingredients.missing = Ingredients.populate(response.ingredients.missing);
                Shopping.bulkAdd(response.ingredients.missing, response);

                $q.when(response.ingredients.present, function(data){
                  var presentIngredients = Cupboard.populate(data);
                  $q.when(presentIngredients, function(presentIngs){
                    Cupboard.bulkReserve(presentIngs, response);
                    response.ingredients.present = presentIngs;
                    self.addLocal(response);
                  });
                });
              }

              function errCB(err) {
                  $log.log('save errCB: ', err);
                  toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
              }


              $resource('/api/users/:userid/meals', {userid: user._id})
              .save(newMeal, _.bind(successCB, self), _.bind(errCB, self));

            });

        }


        function addLocal(newMeal){
          $log.log('in add:', arguments);
          var meals = this.get(), ings;

          ings = newMeal.ingredients;

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
          var deferred = $q.defer(),
          user = Auth.getUser(),
          recipe = Recipes.getRecipe(id),
          mealObj = _.clone(recipe),
          ingredients = Cupboard.process(mealObj.ingredients);
          $log.log('Ingredients for new meal', ingredients);

          $q.when(ingredients, function(data){

            mealObj = angular.extend(mealObj, {
              _id: undefined,
              isComplete: false,
              ingredients:data,
              recipe: id,
              owner: user
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
            $log.log('update successCB: ', response);
              self.updateLocal(response);
          }

          function errCB(err) {
              $log.log('update errCB: ', err);
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
            mealData = mealData.complete.concat(mealData.pending);
            var oldMeal = _.find(mealData, {_id: meal._id});
            oldMeal = meal;
          });
        }

        function reCheckIngredients(){
          var self = this, cupboard, meals;
          meals = self.get();
          cupboard = Cupboard.get();
          $q.when(cupboard, function (cupboardData) { //Get cupboard items

            $q.when(meals, function (mealData) {
              var mls = mealData.pending; //Get pending meals
            _.forEach(mls, function(meal){ //and go through them

              var missing = meal.ingredients.missing, //Get missing ings from that meal
              i, changed = false, item, missingIng;

              for(i=0; i < missing.length; i+=1){ //Go throught them and

                missingIng = missing[i];
                item = _.find(items, function(thisItem){
                  if(thisItem.ingredient._id === missingIng._id){ //compare vs cupboard items
                    return thisItem;
                  }
                });

                if(item){ //if you get a match then move it from missing to present
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

          Cupboard.handleMealDelete(item);
          Shopping.handleMealDelete(item);

          userid = Auth.getUser()._id;

          function CBSuccess(item) {
              $log.log('removed meal item, removing locally', item);
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

        function getMealById(id){
          var self = this, meals, deferred = $q.defer();

          meals = self.get();
          $q.when(meals, function (data) {
            var mls = data.complete.concat(data.pending);
            var meal = _.find(mls, {'_id': id});
            deferred.resolve(meal);
          });
          return deferred.promise;
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
          getMealById: getMealById
        };

    }
}());
