(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .factory('Meals', Meals);

  Meals.$inject = ['$rootScope', '$cookieStore', '$state', '$q', '$log', '$resource', 'toastr', 'Auth', 'Recipes', 'Cupboard', 'Shopping', 'Ingredients', '_', 'Utils', '$window'];

  function Meals($rootScope, $cookieStore, $state, $q, $log, $resource, toastr, Auth, Recipes, Cupboard, Shopping, Ingredients, _, Utils, $window) {

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
          shoppingListItems, cupboardItems, meal, i, len = mealsList.length,
          j, lengths = [];

        for (i = 0; i < len; i += 1) {
          meal = mealsList[i];
          shoppingListItems = meal.ingredients.missing;
          cupboardItems = meal.ingredients.present;

          shoppingListItems = Shopping.getItemsById(shoppingListItems);
          promises = promises.concat(shoppingListItems);

          cupboardItems = Cupboard.getItemsById(cupboardItems);
          promises = promises.concat(cupboardItems);

          lengths.push({
            'sl': shoppingListItems.length,
            'ci': cupboardItems.length
          });

        }

        $q.all(promises).then(function (fulfilled) {
          var pointer = 0,
            sLen, cLen;
          for (i = 0; i < len; i += 1) {
            sLen = lengths[i]['sl'];
            cLen = lengths[i]['ci'];
            mealsList[i].ingredients.missing = fulfilled.splice(pointer, sLen);
            mealsList[i].ingredients.present = fulfilled.splice(pointer + sLen, cLen);
            //pointer += sLen + cLen;
          }

          $log.log(mealsList);

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
        // if (err.status === 401) {
        //   $state.go('login', {
        //     messages: [{
        //       service: 'Auth',
        //       msg: "Your session has expired. Please log in to continue..."
        //     }]
        //   });
        // } else {
        toastr.error('Failed to load meals!', 'Server Error ' + err.status + ' ' + err.data.message);
        //}
        $deferred.reject(err);
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
            recipe;
          $log.log('savedMeal', savedMeal);

          // Get the original recipe to pull the necessary ingredients
          recipe = Recipes.getRecipeById(savedMeal.recipe);
          $q.when(recipe, _.bind(function (originalRecipe) {
            $log.log('originalRecipe', originalRecipe);

            //Populate them
            var popdIngs = Ingredients.populate(originalRecipe.ingredients);
            $q.when(popdIngs, _.bind(function (fullIngs) {
              var self = this,
                originalIngs;

              //process items - ie. split them into present and missing
              originalIngs = Cupboard.process(fullIngs);
              $q.when(originalIngs, _.bind(function (sMealIngs) {
                var self = this,
                  popdSMealIngs,
                  foundItems = sMealIngs.present; // popd cItems
                $log.log('sMealIngs', sMealIngs);

                //Populate those ingredients
                popdSMealIngs = Ingredients.populate(sMealIngs.missing);
                $q.when(popdSMealIngs, _.bind(function (SLIngs) {
                  var self = this,
                    missing, tmpMeal, strategisedMeal;

                  //make a temporary meal object to avoid circular reference
                  tmpMeal = angular.copy(savedMeal);
                  tmpMeal.ingredients = {
                    missing: SLIngs,
                    present: foundItems // popd cItems
                  };

                  //strategise meal - i.e. turn ingredients into cupboard and shopping items
                  strategisedMeal = self.ingsToItems(tmpMeal);
                  $q.when(strategisedMeal, _.bind(function (stratTmpMeal) {
                    var self = this,
                      saving;
                    $log.log('stratTmpMeal', stratTmpMeal);

                    //update the meal on the server
                    savedMeal.ingredients = stratTmpMeal.ingredients;
                    savedMeal.ingredients.present.forEach(function (ing) {
                      ing.reservedFor.hasBeenStrategised = true;
                    });
                    savedMeal.ingredients.missing.forEach(function (ing) {
                      ing.reservedFor.hasBeenStrategised = true;
                    });
                    savedMeal.hasBeenStrategised = true;
                    if (savedMeal.ingredients.missing === 0 && savedMeal.ingredients.present.length === originalRecipe.ingredients.length) {
                      savedMeal.isComplete = true;
                    }
                    saving = self.update(savedMeal, true);
                    $q.when(saving, _.bind(function (updatedMeal) {

                      deferred.resolve(updatedMeal);

                    }, self));

                  }, self));

                }, self));

              }, self));

            }, self));

          }, self));

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
      $log.log('in addLocal:', arguments);
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
        var i, len, thisIng;

        //clone the recipe
        mealObj = _.clone(rec, true);

        //depopulate ingredients
        len = mealObj.ingredients.length;
        for (i = 0; i < len; i += 1) {
          mealObj.ingredients[i] = mealObj.ingredients[i]._id;
        }

        //nullify id and store the recipe id for reference
        mealObj = angular.extend(mealObj, {
          _id: undefined,
          recipe: id
        });

        deferred.resolve(mealObj);

      });

      return deferred.promise;

    }

    //conducts the process of turning a recipe into a full blown meal
    function create(id) {
      var self = this,
        deferred = $q.defer(),
        meal;

      //create a template meal object
      meal = self.createMealObject(id);
      $q.when(meal, function (ml) {

        var finalMeal = self.add(ml);
        $q.when(finalMeal, function (m) {
          deferred.resolve(m);
        });

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
        cupboardItems, shoppingListItems, fullIngs, mealCopy = angular.copy(mealObj);

      //reserve cupboard items for present ings
      cupboardItems = Cupboard.bulkReserve(mealObj.ingredients.present, mealCopy);
      $q.when(cupboardItems, function (cItems) {
        promises = promises.concat(cItems);

        //create Shopping list items for missing ings
        shoppingListItems = Shopping.bulkAdd(mealObj.ingredients.missing, mealCopy);
        $q.when(shoppingListItems, function (SLItems) {
          $log.log('returned SL items', SLItems);
          promises = promises.concat(SLItems);

          $log.log('promises', promises);
          $q.all(promises).then(function (ings) {
            var presIngs = ings.splice(0, plen),
              missingIngs = ings;
            $log.log('in finals of ingsToItems');

            mealObj.ingredients = {
              missing: missingIngs,
              present: presIngs
            };
            $log.log('returning mealObj', mealObj);
            deferred.resolve(mealObj);
          });
        });
      });
      return deferred.promise;
    }

    function depopulate(originalMealObj) {
      var meal, missing, present, mlen, plen, i;

      if (!originalMealObj) {
        toastr.error('We\'re sorry there\'s been an error. Please contact the maintainer');
        throw new Error('Error in Meal.depopulation');
      }

      // else if (item.$promise || item.$resolved) {
      //   throw new Error('Promise sent to Meal.depopulation');
      // }

      meal = angular.copy(originalMealObj);
      missing = meal.ingredients.missing;
      present = meal.ingredients.present;
      mlen = missing.length;
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
        mlen, plen, i;

      if (!depopdMeal) {
        throw new Error('No meal supplied to Meal.populate');
      } else if (_.isObject(depopdMeal) && _.isArray(depopdMeal) || _.isFunction(depopdMeal)) {
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

    /**
     * @params meal {} meal to be updated
     * @params firstPass boolean Used in the complex process of adding a meal.
     *
     **/

    function update(meal, firstPass) {
      var self = this,
        deferred = $q.defer(),
        flatMeal = angular.copy(meal);

      firstPass = firstPass || false;

      //depopulate prior to saving
      flatMeal = self.depopulate(meal);

      function successCB(meal, firstPass, response) {
        $log.log('update successCB: ', response);
        var updatedLocally;
        response.ingredients = meal.ingredients;

        if (firstPass) {
          updatedLocally = self.addLocal(response);
        } else {
          updatedLocally = self.updateLocal(response);
        }

        $q.when(updatedLocally, function (updatedMeal) {
          deferred.resolve(updatedMeal);
        });
      }

      function errCB(meal, err) {
        $log.log('update errCB: ', err);
        toastr.error('Failed to update ' + meal.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
      }

      flatMeal
        .$update(_.bind(successCB, self, meal, firstPass), _.bind(errCB, self, meal, firstPass));

      return deferred.promise;
    }

    function updateLocal(meal) {
      var self = this,
        $meals = self.get(),
        deferred = $q.defer();

      $q.when($meals, function (meals) {
        var targetArray = 'pending';
        //check most likely location (pending meals)
        var oldMeal = _.find(meals.pending, {
          _id: meal._id
        });

        //if not there then check complete meals
        if (!oldMeal) {
          oldMeal = _.find(meals.complete, {
            _id: meal._id
          });
          targetArray = 'complete';
        }

        //if it's not in either, throw an error...
        if (!oldMeal) {
          toastr.error('Error updating meal. Please contact the maintainer');
          throw new Error('Cannot match meal to update in local data');
        }

        //remove the old meal
        // if (oldMeal.isComplete) {
        //   meals.complete.splice(Utils.collIndexOf(meals.complete, oldMeal), 1);
        // } else {
        //   meals.pending.splice(Utils.collIndexOf(meals.pending, oldMeal), 1);
        // }

        meals[targetArray].splice(Utils.collIndexOf(meals[targetArray], oldMeal), 1);

        if (meal.isComplete) {
          meals.complete.push(meal);
        } else {
          meals.pending.push(meal);
        }

        deferred.resolve(meal);
        toastr.success(meal.name + ' sucessfully updated!');
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
        $meals;

      $meals = self.get();
      $q.when($meals, function (meals) {
        var removed;

        if (meal.isComplete) {
          removed = meals.complete.splice(Utils.collIndexOf(meals.complete, meal._id), 1);
        } else {
          removed = meals.pending.splice(Utils.collIndexOf(meals.pending, meal._id), 1);
        }

        removed = removed[0];

        toastr.success(removed.name + ' has been removed from your meals list.');
        deferred.resolve(removed);

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

    function obtainItem(meal, SLItem, CItem) {
      var self = this,
        missing, present, deferred = $q.defer(),
        $updatedMeal, $CItem, rereserveSLItem;

      present = meal.ingredients.present;
      missing = meal.ingredients.missing;

      if (SLItem) {
        missing.splice(Utils.collIndexOf(missing, SLItem), 1);
      }

      present.push(CItem);

      if (missing.length === 0 && present.length > 0) {
        meal.isComplete = true;
      }

      //Update the meal
      $updatedMeal = self.update(meal);
      $q.when($updatedMeal, function (updatedMeal) {
        deferred.resolve(updatedMeal);
      });
      return deferred.promise;
    }

    function loseItem(meal, SLItem, CItem) {
      var self = this,
        present, deferred = $q.defer(),
        $updatedMeal, $SLItem;

      if (meal.isComplete) {
        meal.isComplete = false;
      }

      //Remove cupboard item
      present = meal.ingredients.present;
      present.splice(Utils.collIndexOf(present, CItem), 1);

      meal.ingredients.missing.push(SLItem);

      //Update the meal
      $updatedMeal = self.update(meal);
      $q.when($updatedMeal, function (updatedMeal) {
        deferred.resolve(updatedMeal);
      });

      return deferred.promise;
    }

    function itemBought(SLItem, CItem) {
      var self = this,
        deferred = $q.defer(),
        $meals = self.get();

      $q.when($meals, function (meals) {
        var meal = _.find(meals.pending, {
          _id: CItem.reservedFor._id
        });

        meal = self.obtainItem(meal, SLItem, CItem);
        $q.when(meal, function (correctedMeal) {
          var updated, completeIdx;

          updated = self.update(correctedMeal);
          $q.when(updated, function (updatedMeal) {
            deferred.resolve(updatedMeal);
          });

        });

      });

      return deferred.promise;
    }

    function unreserveItem(item) {
      var self = this,
        thisMeal = item.reservedFor,
        deferred = $q.defer();

      //Historical copies of the meals are kept to avoid JSON recursion issues, so get the latest version of the meal
      thisMeal = self.getMealById(thisMeal._id);
      $q.when(thisMeal, function (latestMeal) {
        var $updatedCItem;

        // tell cupboard
        $updatedCItem = Cupboard.unreserve(item, latestMeal);
        $q.when($updatedCItem, function (updatedCItem) {

          //Create SL item
          var $SLItem = Shopping.add(item.ingredient, latestMeal);
          $q.when($SLItem, function (SLItem) {

            //update meal
            var $updatedMeal = self.loseItem(latestMeal, SLItem, updatedCItem);
            $q.when($updatedMeal, function (updatedMeal) {

              deferred.resolve({
                item: updatedCItem,
                meal: updatedMeal
              });

            });
          });
        });

      });

      return deferred.promise;

    }

    function reserveItem(item, meal) {
      var self = this,
        thisMeal = meal || item.reservedFor,
        deferred = $q.defer();

      //Historical copies of the meals are kept to avoid JSON recursion issues, so get the latest version of the meal
      thisMeal = self.getMealById(thisMeal._id);
      $q.when(thisMeal, function (latestMeal) {

        // tell cupboard
        var $updatedCItem = Cupboard.reserve(item, latestMeal);
        $q.when($updatedCItem, function (updatedCItem) {

          var $SL = Shopping.get();
          $q.when($SL, function (SL) {
            var mealItems, SLItem, $removedSLItem = null;

            //try to find SL equivalent and remove
            mealItems = _.where(SL, {
              reservedFor: {
                _id: meal._id
              }
            });
            SLItem = _.find(mealItems, 'ingredient._id', updatedCItem.ingredient._id);

            if (SLItem) {
              $removedSLItem = Shopping.remove(SLItem);
            } else {
              $removedSLItem = null;
            }

            $q.when($removedSLItem, function (rSLItem) {
              $log.log(rSLItem);
              //update meal
              var $updatedMeal = self.obtainItem(latestMeal, SLItem, updatedCItem);
              $q.when($updatedMeal, function (updatedMeal) {
                deferred.resolve({
                  item: updatedCItem,
                  meal: updatedMeal
                });
              });

            });

          });
        });

      });

      return deferred.promise;

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
      ingsToItems: ingsToItems,
      itemBought: itemBought,
      populate: populate,
      depopulate: depopulate,
      unreserveItem: unreserveItem,
      reserveItem: reserveItem
    };

  }
}());
