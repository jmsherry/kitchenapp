(function () {
    'use strict';

    angular.module('kitchenapp')
        .factory('Populate', Populate);

    Populate.$inject = ['$q', '$log', 'Recipes', 'Ingredients', 'Meals'];

    function Populate($q, $log, Recipes, Ingredients, Meals) {

        /**
         * Return the current logged user.
         *
         * @param obj {}: Target object to be treated
         * @param expand Bool: Whether to populate or depopulate
         */

        function populate(obj) {

            var deferred, keys, promises = [],
                ings = [],
                thisPromise, found, thisProp;

            if (typeof obj !== 'object') {
                throw Error('wrong argument type supplied for object in populate');
            } else if (typeof expand !== 'boolean') {
                throw Error('wrong argument type supplied for expand in populate');
            }

            deferred = $q.defer();
            keys = ['ingredient', 'ingredients', 'reservedFor', 'recipe'];

            for (var key in obj) {
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
                        //find missing and present
                        ings = obj.missing.ingredients.concat(obj.present.ingredients);
                        if (typeof ings[0] === 'string') {

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
            if (_.isArray(thisPromise)) {
                promises = promises.concat(thisPromise);
            } else {
                promises.push(thisPromise);
            }

            $q.all(promises).then(function (data) {
                defer.resolve(data);
            });

            return defer.promise;
        }

        function depopulate(obj) {
            var keys, found, thisProp;

            if (typeof obj !== 'object') {
                throw Error('wrong argument type supplied for object in populate');
            }

            keys = ['ingredient', 'ingredients', 'reservedFor', 'recipe'];

            for (var key in obj) {
                found = keys.indexOf(key);
                thisProp = keys[found];

                switch (thisProp) {

                case 'ingredient':
                    if (typeof obj[thisProp] === 'object') {
                        obj.ingredient = obj.ingredient._id;
                    }
                    break;

                case 'recipe':
                    if (typeof obj[thisProp] === 'object') {
                        obj.recipe = obj.recipe._id;
                    }
                    break;

                case 'ingredients':
                    ings = obj.missing.ingredients.concat(obj.present.ingredients);
                    if (typeof ings[0] === 'object') {

                    }
                    break;

                case 'reservedFor':
                    if (typeof obj.reservedFor === 'object') {
                        obj.reservedFor = obj.reservedFor._id;
                    }
                    break;

                default:
                    $log.warn('Errors depopulating object:', obj, 'expand: ', expand);
                    throw new Error('Errors depopulating');
                    break;
                }

            }
            return obj;
        }

        return {
            populate: populate,
            depopulate: depopulate
        };

    }
}());
