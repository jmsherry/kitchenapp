(function () {
  'use strict';

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

      //AppCode
      'kitchenapp.controllers',
      'kitchenapp.directives',
      'kitchenapp.services',
      'kitchenapp.filters',
      'kitchenapp.templates'

    ]).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'calendarConfigProvider', 'toastrConfig', 'uiSelectConfig', function Configurator($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, calendarConfigProvider, toastrConfig, uiSelectConfig) {
      var positionClass;

      if ($(window).width() < 992) {
        positionClass = 'toast-top-right';
      } else {
        positionClass = 'toast-bottom-right';
      }

      //$httpProvider.interceptors.push('AuthInterceptor');

      //https://github.com/moment/moment/issues/1407
      moment.createFromInputFallback = function (config) {
        // your favorite unreliable string magic, or
        config._d = new Date(config._i);
      };

      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);

      uiSelectConfig.theme = 'select2';

      calendarConfigProvider.setDateFormatter('moment'); // use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.

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

      angular.extend(toastrConfig, {
        timeOut: 5000,
        preventDuplicates: true,
        positionClass: positionClass
      });

    }])
    .run(['$rootScope', 'Auth', '$log', '$window', function runBlock($rootScope, Auth, $log, $window) {

      $rootScope.Auth = Auth;
      $rootScope.isLoading = false;
      $rootScope.isLoggingOut = false;

      $("body").on('click.bgActive', ".btn-group > .btn", function () {
        $(this).addClass("active").siblings().removeClass("active");
      }).on('click.menuSelected', '.navbar-collapse ul a:not(.dropdown-toggle)', function () {
        $('.navbar-toggle:visible').click();
      });

    }]);

}());
