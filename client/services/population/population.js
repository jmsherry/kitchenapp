(function(){
'use strict';

angular.module('kitchenapp')
    .factory('Populate', Populate);

    Populate.$inject = ['$rootScope', '$cookieStore', '$q', '$log', '$resource', 'toastr', 'Auth', 'Recipes', 'Cupboard', 'Shopping', 'Ingredients'];

    function Populate($rootScope, $cookieStore, $q, $log, $resource, toastr, Auth, Recipes, Cupboard, Shopping, Ingredients) {

      /**
       * Return the current logged user.
       *
       * @param obj {}: Target object to be treated
       * @param expand Bool: Whether to populate or depopulate
       */

        function populate(obj, expand){

          if(typeof obj !== 'object'){
            throw Error('wrong argument type supplied for object in populate');
          } else if(typeof expand !== 'boolean'){
            throw Error('wrong argument type supplied for expand in populate');
          }

          var deferred = $q.defer();
          var keys = ['ingredient', 'ingredients', 'reservedFor', 'recipe']

          for(var key in obj){
            var found = keys.indexOf(key);
            var thisProp = keys[found];



            if(thisProp){
              switch(thisProp){

                case 'ingredient':
                if(expand){

                } else {
                  obj.ingredient = ingredient._id
                }
                break;

                case 'recipe':
                if(expand){

                } else {
                  obj.recipe = recipe._id
                }
                break;

                case 'ingredients':
                if(expand){

                } else {
                  ingredient = ingredient._id
                }
                break;

                case 'reservedFor':
                if(expand){

                } else {
                  obj.reservedFor = obj.reservedFor._id
                }
                break;

                default:
                console.warn('check this for errors - OBJ:', obj, 'expand: ', expand);
              }
            }
          }

          return defer.promise;
        }

        return {
          populate: populate
        };

    }
}());
