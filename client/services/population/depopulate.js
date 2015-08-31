(function () {
    'use strict';

    angular.module('kitchenapp')
        .factory('Depopulate', Depopulate);

    Depopulate.$inject = ['$log'];

    function Depopulate($log) {

      /**
       * Depopulates the target object, reducing objects to ObjectIds before saving to server
       *
       * @param obj {}: Target object to be treated
       *
       */

        function depopulate(obj) {
            var keys, key, ings, found, thisProp
            misIngs, presIngs, mLen, pLen;

            if (typeof obj !== 'object') {
                $log.error('wrong argument type supplied for object in depopulate');
                return;
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
                    misIngs = obj.missing.ingredients;
                    mLen = misIngs.length;
                    presIngs = obj.present.ingredients;
                    pLen = presIngs.length;
                    if (misIngs[i] && typeof misIngs[i] === 'object') {
                      for (var i=0; i <mLen; i+=1){
                        ings[i] = ings[i]._id;
                      }
                    }
                    if (presIngs[0] && typeof presIngs[0] === 'object') {
                      for (var i=0; i <mLen; i+=1){
                        presIngs[i] = presIngs[i]._id;
                      }
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

        function bulkDepopulate(arr){
          for (i=0; i <len; i+=1){
            arr[i] = this.depopulate(arr[i]);
          }
          return arr;
        }

        return {
            depopulate: depopulate,
            bulkDepopulate: bulkDepopulate
        };

    }
}());
