//(function () {
//'use strict';

// angular.module('kitchenapp').factory('AuthInterceptor', AuthInterceptor);
//
// AuthInterceptor.$inject = ['$injector', '$log', '$cookies', '$q'];
//
// function AuthInterceptor($injector, $log, $cookies, $q) {
//
  // function gotoLogin(){
  //   $cookies.remove('token');
  //   $stateService.go('login', {
  //     messages: [{
  //       service: 'Auth',
  //       type: 'error',
  //       msg: "Your session has expired. Please log in to continue..."
  //     }]
  //   });
  // }
//
//   return {
//     request: function (config) {
//       $log.log('request: ', arguments);
//       config.headers = config.headers || {};
//       if ($cookies.get('token')) {
//         config.headers.Authorization = 'Bearer ' + $cookies.get('token');
//       }
//       return config;
//     },
//     response: function (res) {
//       //$log.log('In interceptor: response', res);
//       return res;
//     },
//     responseError: function (err) {
//       var $stateService = $injector.get('$state');
//
//       if (err.status === 401) {
//         return $q.reject(err).catch(function(){
//
//         });
//       } else {
//         return $q.reject(err);
//       }
//     }
//   };
// }

//});

/**
   * $http interceptor.
   * On 401 response (without 'ignoreAuthModule' option) stores the request
   * and broadcasts 'event:angular-auth-loginRequired'.
   */
  // angular.module('kitchenapp').config(['$httpProvider', function($httpProvider) {
  //
  //
  //   var interceptor = ['$rootScope', '$q', 'httpBuffer', function($rootScope, $q, httpBuffer) {
  //     function success(response) {
  //       return response;
  //     }
  // 
  //     function error(response) {
  //       if (response.status === 401 && !response.config.ignoreAuthModule) {
  //         var deferred = $q.defer();
  //         httpBuffer.append(response.config, deferred);
  //         $rootScope.$broadcast('event:auth-loginRequired', response);
  //         return deferred.promise;
  //       }
  //       // otherwise, default behaviour
  //       return $q.reject(response);
  //     }
  //
  //     return function(promise) {
  //       return promise.then(success, error);
  //     };
  //
  //   }];
  //
  //   $httpProvider.interceptors.push(interceptor);
  // }]);
