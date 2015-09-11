(function(){
  'use strict';

  angular.module('kitchenapp.controllers',[]);
  angular.module('kitchenapp.directives',[]);
  angular.module('kitchenapp.services',[]);
  angular.module('kitchenapp.filters',[]);
  angular.module('kitchenapp.templates',[]);

  angular.module('kitchenapp', [
    //Native services
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngTouch',
    'ngMessages',
    'ngAria',

    //3rd party
    'btford.socket-io',
    'ui.router',
    'ui.grid',
    'ui.grid.selection',
    'mwl.calendar',
    'ui.bootstrap',
    'ui.gravatar',
    'toastr',
    'nvd3',
    'ui.select',

    //AppCode
    'kitchenapp.controllers',
    'kitchenapp.directives',
    'kitchenapp.services',
    'kitchenapp.filters',
    'kitchenapp.templates'

  ]).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'calendarConfigProvider', 'toastrConfig', 'uiSelectConfig', function Configurator($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, calendarConfigProvider, toastrConfig, uiSelectConfig) {
      var positionClass;

      if($(window).width() < 992){
        positionClass = 'toast-top-right';
      } else {
        positionClass = 'toast-bottom-right';
      }



      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('authInterceptor');

      uiSelectConfig.theme = 'select2';

      // calendarConfigProvider.configureDateFormats({
      //   hour: 'HH:mm' //this will configure the hour view to display in 24 hour format rather than the default of 12 hour
      // });
      //
      // calendarConfigProvider.configureTitleFormats({
      //   day: 'ddd D MMM' //this will configure the day view title to be shorter
      // });

      angular.extend(toastrConfig, {
        timeOut: 5000,
        positionClass: positionClass
      });

    }])
    .factory('authInterceptor', ['$rootScope', '$q', '$cookieStore', '$location', function authInterceptor($rootScope, $q, $cookieStore, $location) {
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
    }])
    .run(['$rootScope', 'Auth', function runBlock($rootScope, Auth) {

      $rootScope.Auth = Auth;
      $rootScope.isLoading = false;
      $rootScope.isLoggingOut = false;

      $("body").on('click.bgActive', ".btn-group > .btn", function(){
          $(this).addClass("active").siblings().removeClass("active");
      }).on('click.menuSelected', '.navbar-collapse ul a:not(.dropdown-toggle)', function () {
          $('.navbar-toggle:visible').click();
      })
      // .on('click.button', 'button', function(){ // this could be used to remove focus from buttons but might break accessibility
      //   $(this).blur();
      // });

    }]);


}());
