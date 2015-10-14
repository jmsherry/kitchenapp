//(function () {
'use strict';

angular.module('kitchenapp').factory('AuthInterceptor', AuthInterceptor);

AuthInterceptor.$inject = ['$injector', '$log', '$cookieStore'];

function AuthInterceptor($injector, $log, $cookieStore) {

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
        $cookieStore.remove('token');
        $stateService.go('login', {
          messages: [{
            service: 'Auth',
            type: 'error',
            msg: "Your session has expired. Please log in to continue..."
          }]
        });
        return $q.reject(rejection);
      } else {
        return rejection;
      }
    }
  };
}

//});
