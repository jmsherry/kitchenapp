(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .factory('Recipes', Recipes);

  Recipes.$inject = ['$rootScope', '$cookieStore', '$q', '$http', '$resource', 'toastr', '_'];

  function Recipes($rootScope, $cookieStore, $q, $http, $resource, toastr, _) {

    var _recipes = [],
      _resource = $resource('/api/recipes/:itemid', {
        itemid: '@_id'
      });

    function init() {
      console.log('recipes init');
      var $deferred = $q.defer();
      _recipes = $deferred.promise;

      function successCB(data) {
        console.log('in successCB', arguments);
        $deferred.resolve(data);
        console.log('Recipes service loaded.', _recipes, data);
      }

      function errorCB(err) {
        $log.log('in recs init errCB', arguments);
        // if (err.status === 401) {
        //   self.$state.go('login', {
        //     messages: [{
        //       service: 'Auth',
        //       type: 'error',
        //       msg: "Your session has expired. Please log in to continue..."
        //     }]
        //   });
        // } else {
          toastr.error('Failed to load recipes!', 'Server Error ' + err.status + ' ' + err.data.message);
        //}
        deferred.reject(err);
      }

      _recipes.then(function (data) {
        console.log('in recs then', arguments);
        console.log(_recipes);
        _recipes = data;
      });

      _resource.query(successCB, errorCB);
    }

    function get() {
      console.log('GET', _recipes);
      return _recipes;
    }

    function save(newRecipe) {
      console.log('save args', arguments);
      console.log('SAVE _recipes: ', _recipes);
      var self = this;

      function successCB(response) {
        console.log('save successCB: ', response);
        self.addLocal(response.recipe);
      }

      function errCB(err) {
        console.log('save errCB: ', err);
        toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
      }

      _resource.save(newRecipe, _.bind(successCB, self), _.bind(errCB, self));
    }

    function addLocal(newRec) {
      console.log('in add:', arguments);
      var self = this,
        recs = self.get();

      $q.when(recs, function (recs) {
        recs.push(newRec);
        toastr.success(newRec.name + " added!");
      });

    }

    function getRecipeById(id) {
      var self = this,
        recs = self.get(),
        requiredRec, deferred = $q.defer();
      $q.when(recs, function (recipes) {
        requiredRec = _.find(recs, {
          _id: id
        });
        deferred.resolve(requiredRec);
      });
      return deferred.promise;
    }

    init();

    return {
      init: init,
      get: get,
      addLocal: addLocal,
      save: save,
      getRecipeById: getRecipeById
    };

  }
}());
