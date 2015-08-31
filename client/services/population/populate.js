(function () {
    'use strict';

    angular.module('kitchenapp')
        .factory('Populate', Populate);

    Populate.$inject = ['$q', '$log', 'Recipes', 'Ingredients', 'Meals'];

    function Populate($q, $log, Recipes, Ingredients, Meals) {

        /**
         * Populates the ObjectId s in the target object
         *
         * @param obj {}: Target object to be treated
         *
         */

        function populate(obj) {

            var deferred, keys, promises = [],
                ings = [],
                thisPromise, thesePromises = [], found, thisProp,
                misIngs, presIngs, mLen, pLen;

            if (typeof obj !== 'object') {
                throw Error('wrong argument type supplied for object in populate');
            }

            deferred = $q.defer();
            keys = ['ingredient', 'ingredients', 'reservedFor', 'recipe'];

            for (var key in obj) {
              if(obj.hasOwnProperty(key)){
                found = keys.indexOf(key);
                thisProp = keys[found];

                if (thisProp) {
                    switch (thisProp) {

                    case 'ingredient':
                        if (typeof obj.ingredient === 'string') {
                            thisPromise = Ingredients.getIngredientById(obj.ingredient);
                            obj.ingredient = thisPromise;
                        }
                        break;

                    case 'recipe':
                        if (typeof obj.recipe === 'string') {
                            thisPromise = Recipes.getRecipeById(obj.recipe);
                            obj.recipe = thisPromise;
                        }
                        break;

                    case 'ingredients':
                        misIngs = obj.missing.ingredients;
                        mLen = misIngs.length;
                        presIngs = obj.present.ingredients;
                        pLen = presIngs.length;

                        if (misIngs.length && typeof misIngs[0] === 'string') {
                          for (var i=0; i <mLen; i+=1){
                            thisPromise = Ingredient.getIngredientById(misIngs[0]);
                            misIngs[0] = thisPromise;
                            thesePromises.push(thisPromise);
                          }
                        }
                        if (presIngs.length && typeof presIngs[0] === 'string') {
                          for (var i=0; i <mLen; i+=1){
                            thisPromise = Ingredient.getIngredientById(presIngs[0]);
                            presIngs[0] = thisPromise;
                            thesePromises.push(thisPromise);
                          }
                        }
                        break;

                    case 'reservedFor':
                        if (typeof obj.reservedFor === 'string') {
                            thisPromise = Meals.getMealById();
                            obj.reservedFor = thisPromise;
                        }
                        break;

                    default:
                        $log.warn('Errors populating object:', obj, 'expand: ', expand);
                        throw new Error('Errors populating');
                        break;
                    }

                }
              }
            }
            if (_.isArray(thesePromises)) {
                promises = promises.concat(thesePromises);
            } else {
                promises.push(thisPromise);
            }

            $q.all(promises).then(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        function bulkPopulate(arr){
          var promises = [], i, len = arr.length, deferred = $q.defer();
          for (i=0; i <len; i+=1){
            arr[i] = this.populate(arr[i]);
            promises.push(arr[i]);
          }
          $q.all(promises).then(function(data){
            deferred.resolve(data);
          });
          return deferred.promise;
        }


        return {
            populate: populate,
            bulkPopulate: bulkPopulate
        };

    }
}());
