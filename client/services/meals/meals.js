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

            toastr.success(newMeal.name + " added to your meals list!");
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

        function depopulate(meal){
          var missing = meal.ingredients.missing,
          present = meal.ingredients.present,
          mlen = missing.length,
          plen = present.length;

          for(var i=0; i< plen; i+=1){
            present[i] = present[i]._id;
          }

          for(var i=0; i< mlen; i+=1){
            missing[i] = missing[i]._id;
          }

          //For safety remove any promise cruft
          delete(meal.$promise);
          delete(meal.$resolved);

          return meal;
        }

        function update(meal){
          var self = this,
          deferred = $q.defer(),
          userid = Auth.getUser()._id,
          mealid = meal._id,
          flatMeal;

          //Copy the meal and depopulate it to itemIds
          flatMeal = _.cloneDeep(meal);
          flatMeal = self.depopulate(flatMeal);

          function successCB(meal, response) {
            $log.log('update successCB: ', response);
            var updatedLocally;
              response.ingredients = meal.ingredients;
              updatedLocally = self.updateLocal(response);
              $q.when(updatedLocally, function(updatedMeal){
                deferred.resolve(updatedMeal);
              });
          }

          function errCB(meal, err) {
              $log.log('update errCB: ', err);
              toastr.error('Failed to update ' + meal.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
          }


          $resource('/api/users/:userid/meals/:mealid',
          {userid: userid, mealid:mealid},
          {update: { method: 'PUT'}})
          .update({meal: flatMeal}, _.bind(successCB, self, meal), _.bind(errCB, self, meal));

          return deferred.promise;
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
            toastr.success(meal.name + ' has been removed from your meals list.');
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

        function obtainItem(meal, item){
          var missing = meal.ingredients.missing;
          missing.splice(missing.indexOf(item.ingredient), 1);
          meal.ingredients.present.push(item);
          return meal;
        }

        function loseItem(meal, item){
          var present = meal.ingredients.missing;
          present.splice(present.indexOf(item), 1);
          meal.ingredients.missing.push(item.ingredient);
          return meal;
        }

        function itemBought(item){
          var self = this, meals = self.get();
          $q.when(meals, function (data) {
            var meal = _.find(data.pending, {_id: item.reservedFor}), updated; //item is unpopulated at this stage
            meal = self.obtainItem(meal, item);

            if(meal.ingredients.missing.length === 0){
              meal.isComplete = true;
            }

            updated = self.update(meal);
            $q.when(updated, function(savedMeal){
              data.pending.splice(data.pending.indexOf(savedMeal), 1);
              data.complete.push(savedMeal);
            });
          });
        }


        init();

        return {
          init: init,
          create: create,
          createMealObject: createMealObject,
          add: add,
          addLocal: addLocal,
          get: get,
          getMealById: getMealById,
          update: update,
          updateLocal: updateLocal,
          remove: remove,
          removeLocal: removeLocal,
          obtainItem: obtainItem,
          loseItem: loseItem,
          itemBought: itemBought,
          depopulate: depopulate
        };

    }
}());
