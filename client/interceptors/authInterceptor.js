(function () {
  'use strict';

angular.module('kitchenapp').factory('AuthInterceptor', AuthInterceptor);

AuthInterceptor.$inject = ['$injector', '$log'];

function AuthInterceptor($injector, $log) {

    return {
      response: function(res){
        $log.log('In interceptor: response', res);
        return res;
      },
      responseError: function (rejection) {
        var $stateService = $injector.get('$state');
        if (rejection.status === 401) {
          $stateService.go('login', {
            messages: [{
              service: 'Auth',
              type: 'error',
              msg: "Your session has expired. Please log in to continue..."
            }]
          });
        } else {
          return rejection;
        }
      }
    };
  }

});
