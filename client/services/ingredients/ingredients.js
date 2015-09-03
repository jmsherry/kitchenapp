(function(){
'use strict';

angular.module('kitchenapp.services')
    .factory('Ingredients', Ingredients);

    Ingredients.$inject = ['$rootScope', '$cookieStore', '$q', '$http', '$resource', 'toastr', '$', '_', '$log'];

    function Ingredients($rootScope, $cookieStore, $q, $http, $resource, toastr, $, _, $log) {

        var _ingredients = [],
        _resource = $resource('/api/ingredients');

         function init() {
          $log.log('ingredients init');
          var $deferred = $q.defer();
          _ingredients = $deferred.promise;

            function successCB(data){
              $log.log('in successCB', arguments);
              $deferred.resolve(data);
              $log.log('Ingredients service loaded.', _ingredients, data);
            }

            function errCB(err){
              $log.log('in errCB', arguments);
              $deferred.reject(err);
              toastr.error('Failed to load ingredients!', 'Server Error ' + err.status + ' ' + err.data.message);
            }

            _ingredients.then(function(data){
              $log.log('in ings then', arguments);
              $log.log('_ingredients before', _ingredients);
              _ingredients = data;
              $log.log('_ingredients after', _ingredients);
            });

            _resource.query(successCB, errCB);
         }

        function get() {
          $log.log('GET', _ingredients);
          return _ingredients;
        }

        function save(newIngredient) {
            $log.log('save args', arguments);
            $log.log('SAVE _ingredients: ', _ingredients);

            function successCB(response) {
              $log.log('save successCB: ', response);
                this.add(response.ingredient);
            }

            function errCB(err) {
                $log.log('save errCB: ', err);
                toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
            }


            _resource.save(newIngredient, _.bind(successCB, this), _.bind(errCB, this));

        }

        function add(newIng){
          $log.log('in add:', arguments);
          var ings = this.get();

          $q.when(ings, function(ings){
            ings.push(newIng);
            toastr.success(newIng.name + " added!");
          });
        }

        function populate(idsArray){
          var ings, deferred = $q.defer();

          if (_.isPlainObject(idsArray)) {
            idsArray = [idsArray];
          } else if (!_.isArray(idsArray)) {
            throw new Error('Wrong type of argument passed to Ingredients.populate');
          }

          ings = this.get();
          $q.when(ings, function(fullIngs){
            var populated = [];
            $.each(idsArray, function(i, id){
              var ing = _.find(fullIngs, {_id: id});
              populated.push(ing);
            });

            deferred.resolve(populated);

          });
          return deferred.promise;
        }

        function getIngredientById(id){
          var deferred = $q.defer(), ings;
          ings = this.get();

          $q.when(ings, function(data){
            var item = _.find(data, {'_id': id});
            deferred.resolve(item);
          });

           return deferred.promise;
        }

        init();

        return {
          _ings: _ingredients,
          init: init,
          get: get,
          getIngredientById: getIngredientById,
          add: add,
          save: save,
          populate: populate
        };

    }
}());
