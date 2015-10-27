(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .service('Auth', Auth);

  Auth.$inject = ['$rootScope', '$cookies', '$q', '$http', '$timeout', '$state', '$log', 'toastr'];

  function Auth($rootScope, $cookies, $q, $http, $timeout, $state, $log, toastr) {

    var deferred = $q.defer(),
    _user = deferred.promise;



    if ($cookies.get('token')) {
      $http.get('/api/users/me')
        .then(function successCB(res) {
          $log.log('testSession successCB: ', arguments);
          deferred.resolve(res.data);
        }, function errCB(err) {
          $log.error('testSession errCB', arguments);
        })
        .catch(function errCB(err) {
          $log.error('testSession catch', arguments);
        });
    }

    /**
     * Signup
     *
     * @param user
     * @returns {promise}
     */
    this.signup = function signup(user) {
      var deferred = $q.defer();
      $http.post('/api/users', user)
        .then(function successCallback(res) {
          _user = res.data.user;
          $cookies.put('token', res.data.token);
          deferred.resolve();
        }, function errorCallback(err) {
          deferred.reject(err.data);
        }).catch(function handleError(err) {
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
    this.login = function login(user) {

      $http.post('/auth/local', user)
        .then(function successCallback(res) {
          var self = this;
          $cookies.put('token', res.data.token);
          //localStorageService.set('token', res.data.token);
          $rootScope.$broadcast('login');
          //self.loginConfirmed(res.data.user, addToken);
          return deferred.resolve(res.data.user);
        }, function errorCallback(err) {
          var self = this;
          //self.loginCancelled();
          deferred.reject(err.data);
        }).catch(function handleError(err) {
          deferred.reject(err.data);
        });

      return _user;
    };

    /**
     * Logout
     */
    this.logout = function logout() {
      $rootScope.isLoggingOut = true;
      _user = null;
      $cookies.remove('token');
      //localStorageService.remove('token');
      $state.go('home');
      $rootScope.$broadcast('logout');

      $timeout(function () {
        $rootScope.isLoggingOut = false;
        $log.log('logging out done');
      }, 500);

    };

    /**
     * Check if user is logged in
     *
     * @returns {boolean}
     */
    this.isLoggedIn = function isLoggedIn() {
      var deferred = $q.defer();
      $q.when(_user, function (usr) {
        if(usr.hasOwnProperty('email')){
          deferred.resolve(true);
        } else {
          deferred.reject(false);
        }
      });
      return deferred.promise;
    };

    /**
     * Returns the user
     *
     * @returns {object}
     */
    this.getUser = function getUser() {
      var deferred = $q.defer();
      $q.when(_user, function (usr) {
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
      $http.put('/api/users/' + user._id, user)
        .then(function successCallback(res) {
          _user = res.data;
          deferred.resolve(_user);
        }, function errorCallback(err) {
          deferred.reject(err.data);
        }).catch(function handleError(err) {
          deferred.reject(err.data);
        });
      return deferred.promise;
    };

    /**
     * Checks if a user is logged in, and if not redirects them to the home view.
     *
     */

    this.checkAuthorised = function checkAuthorised() {
      var self = this, loggedIn;
      loggedIn = self.isLoggedIn();
      $q.when(loggedIn, function(res){
        if(res.data === false){
          state.go('home');
        }
      });
    };

  }

}());
