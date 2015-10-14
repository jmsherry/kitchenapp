(function(){
  'use strict';

  angular.module('kitchenapp.services')
    .service('Auth', Auth);

    Auth.$inject = ['$rootScope', '$cookieStore', '$q', '$http', '$timeout', '$state', '$log', 'toastr'];

    function Auth($rootScope, $cookieStore, $q, $http, $timeout, $state, $log, toastr) {

      var _user = {};

      if ($cookieStore.get('token')) {
        $http.get('/api/users/me')
          .then(function (res) {
            $log.log('Logged in: ', res);
            _user = res.data;
          })
          .catch(function (err) {
            $log.info('Tried early log in and failed');
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
            $rootScope.$broadcast('login');
            deferred.resolve(_user);
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
        $rootScope.isLoggingOut = true;
        $cookieStore.remove('token');
        $state.go('home');
        $rootScope.$broadcast('logout');
        _user = {};
        $timeout(function(){
          $rootScope.isLoggingOut = false;
          $log.log('logging out done');
        }, 500);

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
        var deferred = $q.defer();
        $q.when(_user, function(usr){
          deferred.resolve(usr);
        });
        return deferred.promise;
      };


      /**
       * Update
       *
       * @param user
       * @returns {promise}
       */
      this.updateUser = function updateUser(user) {
        $log.log(arguments);
        var deferred = $q.defer();
        $http.put('/api/users/'+ user._id, user)
          .then(function (res) {
            _user = res.data;
            deferred.resolve(_user);
          })
          .catch(function (err) {
            deferred.reject(err.data);
          });
        return deferred.promise;
      };

      /**
       * Checks if a user is logged in, and if not redirects them to the home view.
       *
       * @returns VOID
       */

      this.checkAuthorised = function checkAuthorised(){
        if(!_user.hasOwnProperty('email')){
          $state.go('home');
        }
      };

    }

}());
