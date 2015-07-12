(function(){
'use strict';

angular.module('kitchenapp')
    .factory('Ingredients', Ingredients);

    Ingredients.$inject = ['$rootScope', '$cookieStore', '$q', '$http', '$resource', 'toastr'];

    function Ingredients($rootScope, $cookieStore, $q, $http, $resource, toastr) {

        var _ingredients = [],
        _resource = $resource('/api/ingredients');

         function init() {
          console.log('firing init');
          var $deferred = $q.defer();
          _ingredients = $deferred.promise;

            function successCB(data){
              console.log('in successCB', arguments);
              $deferred.resolve(data);
              console.log('Ingredients service loaded.', _ingredients, data);
            }

            function errCB(err){
              console.log('in errCB', arguments);
              $deferred.reject(err);
              toastr.error('Failed to load ingredients!', 'Server Error ' + err.status + ' ' + err.data.message);
            }

            _ingredients.then(function(data){
              console.log('in ings then', arguments);
              console.log('_ingredients before', _ingredients);
              _ingredients = data;
              console.log('_ingredients after', _ingredients);
            });

            _resource.query(successCB, errCB);
         }

        function get() {
          console.log('GET', _ingredients);
          return _ingredients;
        }

        function save(newIngredient) {
            console.log('save args', arguments);
            console.log('SAVE _ingredients: ', _ingredients);
            var self = this;

            function successCB(response) {
              console.log('save successCB: ', response);
                self.add(response.ingredient);
            }

            function errCB(err) {
                console.log('save errCB: ', err);
                toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
            }


            _resource.save(newIngredient, _.bind(successCB, self), _.bind(errCB, self));

        }

        function add(newIng){
          console.log('in add:', arguments);
          var self = this,
          ings = self.get();

          $q.when(ings, function(ings){
            ings.push(newIng);
            toastr.success(newIng.name + " added!");
          });
        }

        function populate(idsArray){
          var populated = [], self = this, ings = self.get();

          $q.when(ings, function(ingsArray){
            $.each(idsArray, function(id){
              var ing = _.find(ingsArray, {_id: id});
              populated.push(ing);
            });
          });

          return populated;
        }

        init();

        return {
          _ings: _ingredients,
          init: init,
          get: get,
          add: add,
          save: save,
          populate: populate
        }

    }
}());
