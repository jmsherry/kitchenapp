(function () {
  'use strict';

// This can be done differently, e.g. kitchenapp.cupboard, kitchenapp.shopping, etc. but templates??
  angular.module('kitchenapp.controllers', []);
  angular.module('kitchenapp.directives', []);
  angular.module('kitchenapp.services', []);
  angular.module('kitchenapp.filters', []);
  angular.module('kitchenapp.templates', []);

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
      'pascalprecht.translate',
      'tmh.dynamicLocale',
      // 'http-auth-interceptor',
      // 'angular-jwt',
      // 'LocalStorageModule',

      //AppCode
      'kitchenapp.controllers',
      'kitchenapp.directives',
      'kitchenapp.services',
      'kitchenapp.filters',
      'kitchenapp.templates'

    ])
    // .config(function (localStorageServiceProvider) {
    //   localStorageServiceProvider
    //     .setPrefix('kitchenapp')
    //     .setNotify(true, true);
    // })
    .config(['$translateProvider', 'FALLBACK_LANG', function translateConfigurator($translateProvider, FALLBACK_LANG) {
      $translateProvider.preferredLanguage(FALLBACK_LANG);
      $translateProvider.fallbackLanguage(FALLBACK_LANG);
      $translateProvider.useStaticFilesLoader({
        prefix: '/languages/',
        suffix: '.json'
      });
      $translateProvider.useSanitizeValueStrategy('sanitize');
      $translateProvider.useLocalStorage();
    }])
    .config(['tmhDynamicLocaleProvider', function dynamicLocaleConfigurator(tmhDynamicLocaleProvider) {
      tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
      tmhDynamicLocaleProvider.useStorage('$cookies');
    }])
    .config(['calendarConfigProvider', function calendarConfigurator(calendarConfigProvider) {
      //calendarConfigProvider.setDateFormatter('moment'); // use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.

      calendarConfigProvider.setDateFormats({
        hour: 'HH:mm' // this will configure times on the day view to display in 24 hour format rather than the default of 12 hour
      });

      calendarConfigProvider.setTitleFormats({
        day: 'ddd D MMM' //this will configure the day view title to be shorter
      });

      calendarConfigProvider.setI18nStrings({
        eventsLabel: 'Events', //This will set the events label on the day view
        timeLabel: 'Time' //This will set the time label on the time view
      });

      calendarConfigProvider.setDisplayAllMonthEvents(true); //This will display all events on a month view even if they're not in the current month. Default false.

      calendarConfigProvider.setDisplayEventEndTimes(true); //This will display event end times on the month and year views. Default false.

    }])
    .config(['toastrConfig', function toastrConfigurator(toastrConfig) {
      var positionClass, screenWidth;

      screenWidth = $(window).width();

      if (screenWidth < 992) {
        positionClass = 'toast-top-right';
      } else {
        positionClass = 'toast-bottom-right';
      }

      angular.extend(toastrConfig, {
        timeOut: 5000,
        preventDuplicates: true,
        positionClass: positionClass
      });

    }])
    .config(['moment', function(moment){
      //https://github.com/moment/moment/issues/1407 //<-- May change in the future to go with standard formatting
      moment.createFromInputFallback = function (config) {
        // your favorite unreliable string magic, or
        config._d = new Date(config._i);
      };

    }])
    // .config(['uiSelectConfig', function(){
    //   uiSelectConfig.theme = 'select2';
    // }])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function Configurator($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('AuthInterceptor');

    }])
    .run(['$rootScope', 'Auth', '$log', '$window', 'tmhDynamicLocale', 'FALLBACK_LOCALE',  function runBlock($rootScope, Auth, $log, $window, tmhDynamicLocale, FALLBACK_LOCALE) {

      $rootScope.Auth = Auth;
      $rootScope.isLoading = false;
      $rootScope.isLoggingOut = false;

      tmhDynamicLocale.set(FALLBACK_LOCALE);

      //filling in for missing selected state in bootstrap btn group and closing dropdown after menu item selection
      angular.element('body').on('click.bgActive', ".btn-group > .btn", function () {
        angular.element(this).addClass("active").siblings().removeClass("active");
      }).on('click.menuSelected', '.navbar-collapse ul a:not(.dropdown-toggle)', function () {
        angular.element('.navbar-toggle:visible').click();
      });

    }]);

}());
