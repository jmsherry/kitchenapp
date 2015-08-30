(function () {
    'use strict';

    angular.module('kitchenapp')
        .factory('Populate', Populate);

    Populate.$inject = ['$log'];

    function Depopulate($log) {

      /**
       * Depopulates the target object, reducing objects to ObjectIds before saving to server
       *
       * @param obj {}: Target object to be treated
       * @param expand Bool: Whether to populate or depopulate
       */

        function depopulate(obj) {
            var keys, key, ings, found, thisProp;

            if (typeof obj !== 'object') {
                throw Error('wrong argument type supplied for object in populate');
            }

            keys = ['ingredient', 'ingredients', 'reservedFor', 'recipe'];

            for (key in obj) {
              if(obj.hasOwnProperty(key)){
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
        }

        return {
            depopulate: depopulate
        };

    }
}());
