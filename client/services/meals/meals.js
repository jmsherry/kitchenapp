(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .factory('Meals', Meals);

  Meals.$inject = ['$rootScope', '$cookieStore', '$q', '$log', '$resource', 'toastr', 'Auth', 'Recipes', 'Cupboard', 'Shopping', 'Ingredients', '_'];

  function Meals($rootScope, $cookieStore, $q, $log, $resource, toastr, Auth, Recipes, Cupboard, Shopping, Ingredients, _) {

    var $deferred = $q.defer(),
      _meals = $deferred.promise,
      server;

    function init() {
      $log.log('meals init');

      var owner = Auth.getUser();

      function successCB(mealsList) {
        $log.log('in successCB', arguments);

        var completeMeals, pendingMeals, promises = [],
          self = this,
          missingIngs, presentIngs, meal, i, len = mealsList.length;

        for (i = 0; i < len; i += 1) {
          meal = mealsList[i];
          missingIngs = meal.ingredients.missing;
          presentIngs = meal.ingredients.present;
          missingIngs = Shopping.populate(missingIngs, meal);
          presentIngs = Cupboard.populate(presentIngs, meal);
          promises.push(missingIngs);
          promises.push(presentIngs);
        }

        $q.all(promises).then(function (fulfilled) {

          for (i = 0; i < len; i += 1) {
            mealsList[i].ingredients.missing = fulfilled[i * 2];
            mealsList[i].ingredients.present = fulfilled[i * 2 + 1];
          }

          completeMeals = _.filter(mealsList, {
            isComplete: true
          });
          pendingMeals = _.filter(mealsList, {
            isComplete: false
          });
          mealsList = {
            complete: completeMeals,
            pending: pendingMeals
          };

          $deferred.resolve(mealsList);
          $log.log('meals service loaded.', mealsList);
        });
      }

      function errCB(err) {
        $log.log('in errCB', arguments);
        $deferred.reject(err);
        toastr.error('Failed to load meals!', 'Server Error ' + err.status + ' ' + err.data.message);
      }

      $q.when(owner, function (ownerData) {

        //setup server
        server = $resource('/api/users/:userid/meals/:itemid', {
          userid: ownerData._id,
          itemid: '@_id'
        }, {
          update: {
            method: 'PUT',
            isArray: false
          }
        });

        //setup local
        server.query(_.bind(successCB, self), _.bind(errCB, self));
      });

    }

    function get() {
      return _meals;
    }

    function add(newMeal) {
      $log.log('save args', arguments);

      var user = Auth.getUser(),
        deferred = $q.defer(),
        self = this;

      function successCB(response) {

        $q.when(response, _.bind(function (savedMeal) {
          var self = this,
            popdMeal, savedLocally;

          //reserve items
          pickUpHelper(response);

          //populate meal
          popdMeal = self.populate(savedMeal);

          $q.when(popdMeal, _.bind(function (populatedMeal) {
            //save it locally
            savedLocally = self.addLocal(populatedMeal);
            $q.when(savedLocally, function (finalMeal) {
              deferred.resolve(finalMeal);
            });
          }));


        }, self));

      }

      function errCB(err) {
        $log.log('save errCB: ', err);
        toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
        deferred.reject(err);
      }

      server.save(newMeal, _.bind(successCB, self), _.bind(errCB, self));

      return deferred.promise;

    }

    function addLocal(newMeal) {
      $log.log('in add:', arguments);
      var meals = this.get(),
        ings, deferred = $q.defer();

      ings = newMeal.ingredients;

      $q.when(meals, function (mealsObj) {
        if (newMeal.isComplete) {
          mealsObj.complete.push(newMeal);
        } else {
          mealsObj.pending.push(newMeal);
        }
        deferred.resolve(newMeal);
        toastr.success(newMeal.name + " added to your meals list!");
      });

      return deferred.promise;

    }

    // Turns a recipe id into an initial representation of a meal object
    function createMealObject(id) {
      var deferred = $q.defer(),
        user, recipe, mealObj;

      recipe = Recipes.getRecipeById(id);

      $q.when(recipe, function (rec) {

        mealObj = _.clone(recipe);
        mealObj.ingredients = Cupboard.process(mealObj.ingredients);

        $q.when(mealObj.ingredients, function (ingredients) {
          $log.log('Ingredients for new meal', ingredients);

          mealObj = angular.extend(mealObj, {
            _id: undefined,
            isComplete: false,
            ingredients: ingredients,
            recipe: id
          });

          if (ingredients.missing.length === 0) {
            mealObj.isComplete = true;
          }

          deferred.resolve(mealObj);

        });

      });

      return deferred.promise;

    }

    //conducts the process of turning  a recipe into a full blown meal
    function create(id) {
      var self = this,
        deferred = $q.defer(),
        meal;

      //create a template meal object
      meal = self.createMealObject(id);
      $q.when(meal, function (ml) {
        var strategisedMeal;

        // use the ingredients in the recipe to create shoppingList items and reserve cupboard items
        strategisedMeal = ingsToItems(ml);
        $q.when(strategisedMeal, function (finalMeal) {
          finalMeal = self.add(finalMeal);

          $q.when(finalMeal, function (m) {

            deferred.resolve(m);
          });

        });

      });

      return deferred.promise;

    }

    // Because there's no id in the meal before you save, we took the ids of potential items - now we reserve them.
    function pickUpHelper(meal) {
      var self = this,
        deferred = $q.defer(),
        cupboard, toBeReserved = meal.ingredients.present,
        i, len = toBeReserved.length,
        promises = [];

      cupboard = Cupboard.get();
      $q.when(cupboard, function (cupboardItems) {
        var item;
        for(i=0; i<len; i+=1){
          item = _.find(cupboardItems, {_id: toBeReserved[i]._id});
          item.reservedFor = meal._id;
          item = Cupboard.update(item);
          promises.push(item);
        }
      });

      $q.all(promises).then(function(newlyReservedItems){
        deferred.resolve(newlyReservedItems);
      });

      return deferred.promise;
    }

    /**
     *
     * This is a key function that transforms the ingredients arrays into
     * an array of cupboard and shopping list items by reserving existing
     * cupboard items and adding the missing ingredients as shopping list items.
     *
     **/

    function ingsToItems(mealObj) {
      var self = this,
        deferred = $q.defer(),
        promises = [],
        i, plen = mealObj.ingredients.present.length,
        cupboardItems, shoppingListItems;

      //reserve cupboard items for present ings
      cupboardItems = Cupboard.bulkReserve(mealObj.ingredients.present, mealObj, true);
      $q.when(cupboardItems, function (cItems) {
        promises = promises.concat(cItems);
      });

      //create Shopping list items for missing ings
      shoppingListItems = Shopping.bulkAdd(mealObj.ingredients.missing, mealObj);
      $q.when(shoppingListItems, function (SLItems) {
        promises = promises.concat(SLItems);
      });

      $q.all(promises).then(function (ings) {
        var presIngs = ings.splice(0, plen - 1),
          missingIngs = ings;

        mealObj.ingredients = {
          missing: missingIngs,
          present: presIngs
        };

        deferred.resolve(mealObj);
      })

      return deferred.promise;
    }

    function depopulate(originalMealObj) {
      var meal, missing, present, mlen, plen, i;

      if (!originalMealObj) {
        toastr.error('Error depolulating: No item sent');
        throw new Error('Error in Meal.depopulation');
      } else if (item.$promise || item.$resolved) {
        throw new Error('Promise sent to Meal.depopulation');
      }

      meal = angular.copy(originalMealObj),
        missing = meal.ingredients.missing,
        present = meal.ingredients.present,
        mlen = missing.length,
        plen = present.length;

      for (i = 0; i < plen; i += 1) {
        present[i] = present[i]._id;
      }

      for (i = 0; i < mlen; i += 1) {
        missing[i] = missing[i]._id;
      }

      return meal;
    }

    function populate(depopdMeal) {
      var self = this,
        deferred = $q.defer(),
        promises = [],
        missing, present,
        mlen, plen;

      if (!depopdMeal) {
        throw new Error('No meal supplied to Meal.populate');
      } else if (!_.isPlainObject(depopdMeal)) {
        throw new Error('Wrong type of argument (not an object) supplied to Meal.populate');
      }

      missing = depopdMeal.ingredients.missing,
        present = depopdMeal.ingredients.present,
        plen = present.length;

      for (i = 0; i < plen; i += 1) {
        present[i] = Cupboard.getItemById(present[i]);
        promises.push(present[i]);
      }

      for (i = 0; i < mlen; i += 1) {
        missing[i] = Shopping.getItemById(missing[i]);
        promises.push(missing[i]);
      }

      //could do some code here to populate the owner, but not necessary at this stage
      $q.all(promises).then(function (items) {
        var cItems = items.splice(0, plen - 1),
          SLItems = items;
        depopdMeal.ingredients = {
          missing: SLItems,
          present: cItems
        };
        deferred.resolve(depopdMeal);
      });

      return deferred.promise;
    }

    function update(meal) {
      var self = this,
        deferred = $q.defer(),
        flatMeal;

      //depopulate prior to saving
      flatMeal = self.depopulate(flatMeal);

      function successCB(meal, response) {
        $log.log('update successCB: ', response);
        var updatedLocally;
        response.ingredients = meal.ingredients;
        updatedLocally = self.updateLocal(response);
        $q.when(updatedLocally, function (updatedMeal) {
          deferred.resolve(updatedMeal);
        });
      }

      function errCB(meal, err) {
        $log.log('update errCB: ', err);
        toastr.error('Failed to update ' + meal.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
      }

      flatMeal
        .$update(_.bind(successCB, self, meal), _.bind(errCB, self, meal));

      return deferred.promise;
    }

    function updateLocal(meal) {
      var meals = self.get(),
        deferred = $q.defer();

      $q.when(meals, function (mealData) {
        mealData = mealData.complete.concat(mealData.pending);
        var oldMeal = _.find(mealData, {
          _id: meal._id
        });
        oldMeal = meal;
        deferred.resolve(oldMeal);
        toastr.success(oldMeal.name + ' sucessfully updated!');
      });

      return deferred.promise;

    }

    function remove(meal) {
      var self = this;

      function CBSuccess(meal, response) {
        $log.log('removed meal item, removing locally', meal);
        var removedLocally = self.removeLocal(meal);
        $q.when(removedLocally, function (removedMeal) {
          //toastr.success(meal.name + ' succesfully deleted!');
          toastr.info('Updating your cupboard and shopping list...')
          Cupboard.handleMealDelete(removedMeal);
          Shopping.handleMealDelete(removedMeal);
        });
      }

      function CBError(item) {
        toastr.error('Could not remove ' + item.name + ' from meals.');
      }

      meal.$remove(_.bind(CBSuccess, self, meal), _.bind(CBError, self, meal));
    }

    function removeLocal(meal) {
      var self = this,
        deferred = $q.defer(),
        meals;

      meals = self.get();
      $q.when(meals, function (data) {
        var items, mealItem;

        if (meal.isComplete) {
          items = data.complete;
        } else {
          items = data.pending;
        }

        mealItem = items.splice(items.indexOf(meal), 1);
        mealItem = mealItem[0];
        toastr.success(mealItem.name + ' has been removed from your meals list.');
        deferred.resolve(mealItem);

      });

      return deferred.promise;
    }

    function getMealById(id) {
      var self = this,
        meals, deferred = $q.defer();

      meals = self.get();
      $q.when(meals, function (data) {
        var mls = data.complete.concat(data.pending);
        var meal = _.find(mls, {
          '_id': id
        });
        deferred.resolve(meal);
      });
      return deferred.promise;
    }

    function obtainItem(meal, item) {
      var missing = meal.ingredients.missing;
      missing.splice(missing.indexOf(item.ingredient), 1);
      meal.ingredients.present.push(item);
      return meal;
    }

    function loseItem(meal, item) {
      var present = meal.ingredients.missing;
      present.splice(present.indexOf(item), 1);
      meal.ingredients.missing.push(item.ingredient);
      return meal;
    }

    function itemBought(item) {
      var self = this,
        meals = self.get();
      $q.when(meals, function (data) {
        var meal = _.find(data.pending, {
            _id: item.reservedFor
          }),
          updated; //item is unpopulated at this stage
        meal = self.obtainItem(meal, item);

        if (meal.ingredients.missing.length === 0) {
          meal.isComplete = true;
        }

        updated = self.update(meal);
        $q.when(updated, function (savedMeal) {
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
      populate: populate,
      depopulate: depopulate
    };

  }
}());
