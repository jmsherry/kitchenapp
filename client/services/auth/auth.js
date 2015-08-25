(function(){
  'use strict';

  angular.module('kitchenapp')
    .service('Auth', function ($rootScope, $cookieStore, $q, $http, $location) {

      var _user = {};

      if ($cookieStore.get('token')) {
        $http.get('/api/users/me')
          .then(function (res) {
            _user = res.data;
          })
          .catch(function (err) {
            console.log(err);
          });
      }

      /**
       * Signup
       *
       * @param user
       * @returns {promise}
       */
      this.signup = function (user) {
        var deferred = $q.defer();
        $http.post('/api/users', user)
          .then(function (res) {
            _user = res.data.user;
            $cookieStore.put('token', res.data.token);
            deferred.resolve();
          })
          .catch(function (err) {
            deferred.reject(err.data);
          });
        return deferred.promise;
      };

      /**
       * Login
       *
       * @param user
       * @returns {promise}
       */
      this.login = function (user) {
        var deferred = $q.defer();
        $http.post('/auth/local', user)
          .then(function (res) {
            _user = res.data.user;
            $cookieStore.put('token', res.data.token);
            deferred.resolve();
          })
          .catch(function (err) {
            deferred.reject(err.data);
          });
        return deferred.promise;
      };

      /**
       * Logout
       */
      this.logout = function () {
        $cookieStore.remove('token');
        $location.path('/');
        _user = {};
      };

      /**
       * Check if user is logged
       *
       * @returns {boolean}
       */
      this.isLogged = function () {
        return _user.hasOwnProperty('email');
      };

      /**
       * Returns the user
       *
       * @returns {object}
       */
      this.getUser = function () {
        return _user;
      };


      /**
       * Update
       *
       * @param user
       * @returns {promise}
       */
      // this.updateUser = function updateUser(user) {
      //   var deferred = $q.defer();
      //   $http.put('/api/users', user)
      //     .then(function (res) {
      //       _user = res.data.user;
      //       $cookieStore.put('token', res.data.token);
      //       deferred.resolve();
      //     })
      //     .catch(function (err) {
      //       deferred.reject(err.data);
      //     });
      //   return deferred.promise;
      // };

      /**
       * Checks if a user is logged in, and if not redirects them to the home view.
       *
       * @returns VOID
       */

      this.checkAuthorised = function checkAuthorised(){
        if(!_user.hasOwnProperty('email')){
          $location.path('/');
        }
      };

    });
}());
