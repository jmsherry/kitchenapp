'use strict';

angular.module('ka2', [
  //Native services
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ngTouch',

  //3rd party
  'btford.socket-io',
  'ui.router',
  'ui.grid',
  'mwl.calendar',
  'ui.bootstrap',
  'restangular',
  'ui.gravatar',
  'toastr'//,
  'formly', 
  'formlyBootstrap'
  'angularjs-dropdown-multiselect'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    calendarConfigProvider.configureDateFormats({
      hour: 'HH:mm' //this will configure the hour view to display in 24 hour format rather than the default of 12 hour
    });

    calendarConfigProvider.configureTitleFormats({
      day: 'ddd D MMM' //this will configure the day view title to be shorter
    });

  })
  .factory('authInterceptor',
  function ($rootScope, $q, $cookieStore, $location) {
    return {

      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

    };
  })

  .run(function ($rootScope, Auth) {

    $rootScope.Auth = Auth;

  });
