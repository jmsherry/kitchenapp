//(function () {
'use strict';

angular.module('kitchenapp').factory('AuthInterceptor', AuthInterceptor);

AuthInterceptor.$inject = ['$injector', '$log', '$cookieStore', '$q'];

function AuthInterceptor($injector, $log, $cookieStore, $q) {

  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($cookieStore.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      }
      return config;
    },
    response: function (res) {
      //$log.log('In interceptor: response', res);
      return res;
    },
    responseError: function (rejection) {
      var $stateService = $injector.get('$state');

      if (rejection.status === 401) {
        $q.reject(rejection).catch(function(){
        $cookieStore.remove('token');
        $stateService.go('login', {
          messages: [{
            service: 'Auth',
            type: 'error',
            msg: "Your session has expired. Please log in to continue..."
          }]
        });
        });
      } else {
        return rejection;
      }
    }
  };
}

//});
