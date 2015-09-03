(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .factory('Meals', Meals);

  Meals.$inject = ['$rootScope', '$cookieStore', '$q', '$log', '$resource', 'toastr', 'Auth', 'Recipes', 'Cupboard', 'Shopping', 'Ingredients', '_'];

  function Meals($rootScope, $cookieStore, $q, $log, $resource, toastr, Auth, Recipes, Cupboard, Shopping, Ingredients, _) {

    var $deferred = $q.defer(),
      _meals = $deferred.promise;

    function init() {
      $log.log('meals init');

      var self = this, owner = Auth.getUser();

      function successCB(mealsList) {
        $log.log('in successCB', arguments);

        var completeMeals, pendingMeals, promises = [],
          missingIngs, presentIngs;
        _.each(mealsList, function (meal) {
          missingIngs = meal.ingredients.missing;
          presentIngs = meal.ingredients.present;
          missingIngs = Ingredients.populate(missingIngs);
          presentIngs = Cupboard.populate(presentIngs);
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

      $q.when(owner, function(ownerData){
        $resource('/api/users/:userid/meals/:itemid', {
            userid: ownerData._id,
            itemid: '@_id'
          }, {
            update: {
              method: 'PUT',
              isArray: false
            }
          }).query(_.bind(successCB, self), _.bind(errCB, self));
      });


    }

    function get() {
      return _meals;
    }

    function add(newMeal) {
      $log.log('save args', arguments);
      $log.log('SAVE _meals: ', _meals);
      var user = Auth.getUser(),
        self = this;

      function successCB(response) {
        var addedIngredients, reservedItems;

        $.when(response, function (savedMeal) {
          $log.log('addMeal save successCB: ', savedMeal);

          //add missing ingredients to shopping list
          addedIngredients = Shopping.bulkAdd(response.ingredients.missing, response);
          $q.when(addedIngredients, function (SLItems) {
            savedMeal.ingredients.missing = SLItems;
          });

          //reserve items in cupboard
          reservedItems = Cupboard.bulkReserve(response.items.present, response);
          $q.when(reservedItems, function (cupboardItems) {
            savedMeal.ingredients.present = cupboardItems;
          });

        });

      }

      function errCB(err) {
        $log.log('save errCB: ', err);
        toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
      }

      $resource('/api/users/:userid/meals', {
          userid: user._id
        })
        .save(newMeal, _.bind(successCB, self), _.bind(errCB, self));

    }

    function addLocal(newMeal) {
      $log.log('in add:', arguments);
      var meals = this.get(),
        ings;

      ings = newMeal.ingredients;

      $q.when(meals, function (meals) {
        if (newMeal.isComplete) {
          meals.complete.push(newMeal);
        } else {
          meals.pending.push(newMeal);
        }

        toastr.success(newMeal.name + " added to your meals list!");
      });
    }

    // Turns a recipe id into a meal object
    function createMealObject(id) {
      var deferred = $q.defer(),
        user = Auth.getUser(),
        recipe = Recipes.getRecipeById(id),
        mealObj = _.clone(recipe),
        ingredients = Cupboard.process(mealObj.ingredients);
      $log.log('Ingredients for new meal', ingredients);

      $q.when(ingredients, function (data) {

        mealObj = angular.extend(mealObj, {
          _id: undefined,
          isComplete: false,
          ingredients: data,
          recipe: id,
          owner: user
        });

        if (data.missing.length === 0) {
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

    function depopulate(meal) {
      var missing = meal.ingredients.missing,
        present = meal.ingredients.present,
        mlen = missing.length,
        plen = present.length;

      for (var i = 0; i < plen; i += 1) {
        present[i] = present[i]._id;
      }

      for (i = 0; i < mlen; i += 1) {
        missing[i] = missing[i]._id;
      }

      //For safety remove any promise cruft
      delete(meal.$promise);
      delete(meal.$resolved);

      return meal;
    }

    function update(meal) {
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
        $q.when(updatedLocally, function (updatedMeal) {
          deferred.resolve(updatedMeal);
        });
      }

      function errCB(meal, err) {
        $log.log('update errCB: ', err);
        toastr.error('Failed to update ' + meal.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
      }

      $resource('/api/users/:userid/meals/:mealid', {
          userid: userid,
          mealid: mealid
        }, {
          update: {
            method: 'PUT'
          }
        })
        .update({
          meal: flatMeal
        }, _.bind(successCB, self, meal), _.bind(errCB, self, meal));

      return deferred.promise;
    }

    function updateLocal(meal) {
      var self = this,
        meals;
      meals = self.get();
      $q.when(meals, function (mealData) {
        mealData = mealData.complete.concat(mealData.pending);
        var oldMeal = _.find(mealData, {
          _id: meal._id
        });
        oldMeal = meal;
      });
    }

    function remove(item) {
      var self = this,
        userid;

      Cupboard.handleMealDelete(item);
      Shopping.handleMealDelete(item);

      userid = Auth.getUser()._id;

      function CBSuccess(item) {
        $log.log('removed meal item, removing locally', item);
        self.removeLocal(item);
      }

      function CBError(item) {
        toastr.error('could not remove ' + item.name + ' from meals');
      }

      $resource('/api/users/:userid/meals/:itemid', {
          userid: userid,
          itemid: item._id
        })
        .remove(_.bind(CBSuccess, self, item), _.bind(CBError, self, item));
    }

    function removeLocal(meal) {
      var self = this,
        meals;

      meals = self.get();
      $q.when(meals, function (data) {
        var items;

        if (meal.isComplete) {
          items = data.complete;
        } else {
          items = data.pending;
        }

        items.splice(items.indexOf(meal), 1);
        toastr.success(meal.name + ' has been removed from your meals list.');
      });
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
