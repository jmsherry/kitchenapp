'use strict';

angular.module('kitchenapp', [
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
  'ui.grid.selection',
  'mwl.calendar',
  'ui.bootstrap',
  'restangular',
  'ui.gravatar',
  'toastr',
  'formly',
  'formlyBootstrap'//,
  //'angularjs-dropdown-multiselect'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, calendarConfigProvider, toastrConfig) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    calendarConfigProvider.configureDateFormats({
      hour: 'HH:mm' //this will configure the hour view to display in 24 hour format rather than the default of 12 hour
    });

    calendarConfigProvider.configureTitleFormats({
      day: 'ddd D MMM' //this will configure the day view title to be shorter
    });

    angular.extend(toastrConfig, {
      timeOut: 1500,
      positionClass: 'toast-bottom-right'
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
