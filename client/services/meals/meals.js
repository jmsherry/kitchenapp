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
          missingIngs, presentIngs;

        _.each(mealsList, function (meal) {
          missingIngs = meal.ingredients.missing;
          presentIngs = meal.ingredients.present;
          missingIngs = Ingredients.populate(missingIngs, meal);
          presentIngs = Cupboard.populate(presentIngs, meal);
          promises.push(missingIngs);
          promises.push(presentIngs);
        });

        $q.all(promises).then(function (fulfilled) {

          for (var i = 0, len = mealsList.length; i < len; i += 1) {
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
        deferred = $q.defer();

      function successCB(response) {
        var deferred = $q.defer();
        $q.when(response, function populateMealIngredients(savedMeal) {
          var addedIngredients, reservedItems, mealSaved, missingIngs, presentIngs, ings, self = this;

          $log.log('addMeal save successCB: ', savedMeal);

          //populate ingredients
          missingIngs = Ingredients.populate(savedMeal.ingredients.missing);
          presentIngs = Ingredients.populate(savedMeal.ingredients.present);

          ings = [missingIngs, presentIngs];
          deferred.resolve(processMealIngredients(ings));
        });
        return deferred.promise;
      }



      function processMealIngredients(ings){
        var deferred = $q.defer();
        $q.all(ings).then(function (ingredients) {
          var misIngs = ingredients[0],
            presIngs = ingredients[1],
            promises;

          //add missing ingredients to shopping list
          addedIngredients = Shopping.bulkAdd(misIngs, savedMeal);

          //reserve items in cupboard
          reservedItems = Cupboard.bulkReserve(presIngs, savedMeal);


          promises = [addedIngredients, reservedItems];

          deferred.resolve(placeIngsInMeal(promises));

        });
        return deferred.promise;
      }

      function placeIngsInMeal(promises){
        $q.all(promises).then(function (items) {
          var mIngs = items[0],
            pIngs = items[1];

          savedMeal.ingredients.missing = mIngs;
          savedMeal.ingredients.present = pIngs;

        });
      }

      function saveMealLocally(savedMeal){
        //save the meal locally
        mealSaved = self.addLocal(savedMeal);
        $q.when(mealSaved, function (mealData) {
          deferred.resolve(mealData); //mealData is an object with the meal and the meals array in
        });
      }

      function errCB(err) {
        $log.log('save errCB: ', err);
        toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
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

    // Turns a recipe id into a meal object
    function createMealObject(id) {
      var deferred = $q.defer(),
        user, recipe, mealObj

      user = Auth.getUser();
      recipe = Recipes.getRecipeById(id);
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

      return deferred.promise;

    }

    function create(id) {
      var self = this,
        meal;

      meal = self.createMealObject(id);
      $q.when(meal, function (ml) {
        $q.when(ml.ingredients, function (ings) {
          ml.ings = ings; //an array ids at this point
          self.add(ml);
        });
      });

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

    function update(meal) {
      var self = this,
        deferred = $q.defer(),
        userid = Auth.getUser()._id,
        mealid = meal._id,
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
          toastr.success(meal.name + ' succesfully deleted!');
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
      depopulate: depopulate
    };

  }
}());
