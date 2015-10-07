(function () {
    'use strict';

    angular.module('kitchenapp.services')
      .factory('TourSteps', TourSteps);

    TourSteps.$inject = ['$log', '$', '_', '$state', '$timeout', 'toastr', '$window'];

    function TourSteps($log, $, _, $state, $timeout, toastr, $window) {

      var configuredTour = [],
        tours = {
          homeTour: {
            desktop: [{
              path: "/",
              host: "",
              element: ".navbar-brand",
              placement: "right",
              title: "The Nav Bar",
              content: "This link will take you home...",
              orphan: false,
              onShow: function (tour) {},
              onShown: function (tour) {},
              onHide: function (tour) {},
              onHidden: function (tour) {},
              onNext: function (tour) {
                //$state.go('food-calendar');
              },
              onPrev: function (tour) {},
              onPause: function (tour) {},
              onResume: function (tour) {},
              onRedirectError: function (tour) {}
            }],
            mobile: [{
              path: "/",
              host: "",
              element: ".navbar-brand",
              placement: "right",
              title: "The Nav Bar",
              content: "This link will take you home...",
              orphan: false,
              onShow: function (tour) {},
              onShown: function (tour) {},
              onHide: function (tour) {},
              onHidden: function (tour) {},
              onNext: function (tour) {
                //$state.go('food-calendar');
                toggleMobileMenu('open');
              },
              onPrev: function (tour) {},
              onPause: function (tour) {},
              onResume: function (tour) {},
              onRedirectError: function (tour) {}
            }]
          },
          logoutTour: {
            desktop: [{
              path: "/",
              host: "",
              element: "#auth-menu li:last-child a",
              placement: "left",
              title: "Login/Logout",
              content: "Log in and out here...",
              orphan: false,
              onShow: function (tour) {},
              onShown: function (tour) {},
              onHide: function (tour) {},
              onHidden: function (tour) {},
              onNext: function (tour) {
                $state.go('profile');
              },
              onPrev: function (tour) {},
              onPause: function (tour) {},
              onResume: function (tour) {},
              onRedirectError: function (tour) {}
            }],
            mobile: [{
              path: "/",
              host: "",
              element: "#auth-menu li:last-child a",
              placement: "above",
              title: "Login/Logout",
              content: "Log in and out here...",
              orphan: false,
              onShow: function (tour) {},
              onShown: function (tour) {},
              onHide: function (tour) {},
              onHidden: function (tour) {},
              onNext: function (tour) {
                $state.go('profile');
                toggleMobileMenu('open');
              },
              onPrev: function (tour) {},
              onPause: function (tour) {},
              onResume: function (tour) {},
              onRedirectError: function (tour) {}
            }]
        },
        profileTour: {
          desktop: [{
            path: "/",
            host: "",
            element: "#auth-menu li:first-child a",
            placement: "left",
            title: "Profile",
            content: "View and edit your profile here",
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {

            },
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          },{
            path: "/",
            host: "",
            element: "#auth-menu li:first-child a",
            placement: "right",
            title: "Your Avatar",
            content: "Your avatar is provided by gravatar.com and is adustable when you change your email",
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
            },
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          },{
            path: "/",
            host: "",
            element: ".personal-details dd:first-of-type button",
            placement: "above",
            title: "Change Email",
            content: "You can update your email here...",
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
            },
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          },{
            path: "/",
            host: "",
            element: ".personal-details dd:last-of-type button",
            placement: "above",
            title: "Change Budget",
            content: "You can adjust your weekly budget here.",
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
            },
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }],
          mobile: [{
            path: "/",
            host: "",
            element: "#auth-menu li:first-child a",
            placement: "above",
            title: "Profile",
            content: "View and edit your profile here",
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
              toggleMobileMenu('close');
            },
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          },{
            path: "/",
            host: "",
            element: "#auth-menu li:first-child a",
            placement: "right",
            title: "Your Avatar",
            content: "Your avatar is provided by gravatar.com and is adustable when you change your email",
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
            },
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          },{
            path: "/",
            host: "",
            element: ".personal-details dd:first-of-type button",
            placement: "above",
            title: "Change Email",
            content: "You can update your email here...",
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
            },
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          },{
            path: "/",
            host: "",
            element: ".personal-details dd:last-of-type button",
            placement: "above",
            title: "Change Budget",
            content: "You can adjust your weekly budget here.",
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
            },
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }]
        },
        ingredientsListTour: {
          desktop: [{
            element: ".nav.navbar-nav:first-child > li:first-child a",
            placement: "left",
            title: "The Food Calendar",
            content: "This view lets you place meals...",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
              $('.navbar-toggle').click();
            },
            onPrev: function (tour) {
              //$('.navbar-toggle').click();
            },
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".nav.navbar-nav:first-child > li:first-child a",
            placement: "bottom",
            title: "The Food Calendar",
            content: "This view lets you place meals...",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {
              $('.navbar-toggle').click();
            },
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".cal-pagination-ctrls button:last-child",
            placement: "right",
            title: "Calendar Pagination Controls",
            content: "See next, previous or current year/month/week/day by pressing these buttons",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".cal-view-buttons button:first-child",
            placement: "left",
            title: "Calendar View Controls",
            content: "Set whether you're looking at the year/month/week/day by pressing these buttons",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".cal-day-today",
            placement: "below",
            title: "Days",
            content: "Click on the day to see events scheduled for it in the grey area that opens below",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {

            },
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }],
          mobile: [

          ]
        },
        ingredientsAddTour: {
          desktop: [

          ],
          mobile: [

          ]
        },
        recipesListTour: {
          desktop: [

          ],
          mobile: [

          ]
        },
        recipesAddTour: {
          desktop: [

          ],
          mobile: [

          ]
        },
        shopplingListTour: {
          desktop: [

          ],
          mobile: [

          ]
        },
        cupboardTour: {
          desktop: [

          ],
          mobile: [

          ]
        },
        mealsListTour: {
          desktop: [

          ],
          mobile: [

          ]
        },
        calendarTour: {
          desktop: [{
            element: ".nav.navbar-nav:first-child > li:first-child a",
            placement: "left",
            title: "The Food Calendar",
            content: "This view lets you place meals...",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
              $('.navbar-toggle').click();
            },
            onPrev: function (tour) {
              //$('.navbar-toggle').click();
            },
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".nav.navbar-nav:first-child > li:first-child a",
            placement: "bottom",
            title: "The Food Calendar",
            content: "This view lets you place meals...",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {
              $('.navbar-toggle').click();
            },
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".cal-pagination-ctrls button:last-child",
            placement: "right",
            title: "Calendar Pagination Controls",
            content: "See next, previous or current year/month/week/day by pressing these buttons",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".cal-view-buttons button:first-child",
            placement: "left",
            title: "Calendar View Controls",
            content: "Set whether you're looking at the year/month/week/day by pressing these buttons",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".cal-day-today",
            placement: "below",
            title: "Days",
            content: "Click on the day to see events scheduled for it in the grey area that opens below",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {
              var $dayCell = $('this.element');
              $log.log($dayCell);
              $dayCell.click();
              $timeout(function () {
                $log.log('clicking 1');
                $dayCell.click();
              }, 1000);
              $timeout(function () {
                $log.log('clicking 2');
                $dayCell.click();
              }, 1500);
              $timeout(function () {
                $log.log('clicking 3');
                $dayCell.click();
              }, 2000);
            },
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }],
          mobile: [{
            element: ".nav.navbar-nav:first-child > li:first-child a",
            placement: "right",
            title: "The Food Calendar",
            content: "This view lets you place meals...",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {
              $('.navbar-toggle').click();
            },
            onPrev: function (tour) {
              //$('.navbar-toggle').click();
            },
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".nav.navbar-nav:first-child > li:first-child a",
            placement: "bottom",
            title: "The Food Calendar",
            content: "This view lets you place meals...",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {
              $('.navbar-toggle').click();
            },
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".cal-pagination-ctrls button:last-child",
            placement: "right",
            title: "Calendar Pagination Controls",
            content: "See next, previous or current year/month/week/day by pressing these buttons",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".cal-view-buttons button:first-child",
            placement: "left",
            title: "Calendar View Controls",
            content: "Set whether you're looking at the year/month/week/day by pressing these buttons",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {},
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }, {
            element: ".cal-day-today",
            placement: "below",
            title: "Days",
            content: "Click on the day to see events scheduled for it in the grey area that opens below",
            // next: 2,
            // prev: 0,
            animation: true,
            container: "body",
            backdrop: false,
            backdropContainer: 'body',
            backdropPadding: false,
            redirect: true,
            reflex: false,
            orphan: false,
            onShow: function (tour) {
              var $dayCell = $('this.element');
              $log.log($dayCell);
              $dayCell.click();
              $timeout(function () {
                $log.log('clicking 1');
                $dayCell.click();
              }, 1000);
              $timeout(function () {
                $log.log('clicking 2');
                $dayCell.click();
              }, 1500);
              $timeout(function () {
                $log.log('clicking 3');
                $dayCell.click();
              }, 2000);
            },
            onShown: function (tour) {},
            onHide: function (tour) {},
            onHidden: function (tour) {},
            onNext: function (tour) {},
            onPrev: function (tour) {},
            onPause: function (tour) {},
            onResume: function (tour) {},
            onRedirectError: function (tour) {}
          }]
        }
    };

    function toggleMobileMenu(state) {
      var $menuButton = $('.navbar-toggle');
      if (state === 'open') {
        if ($menuButton.hasClass('collapsed')) {
          $menuButton.click();
        } else {
          $log.warn('Menu was already open');
        }
      } else if (state === 'close') {
        if (!$menuButton.hasClass('collapsed')) {
          $menuButton.click();
        } else {
          $log.warn('Menu was already closed');
        }
      } else {
        $log.warn('No state provided to toggleMobileMenu');
      }
    }

    function getSteps(customTour) {
      var tourType, configuredTour = [];
      if ($window.innerWidth < 768) {
        tourType = 'mobile';
      } else {
        tourType = 'desktop';
      }

      $log.info('tourType = ' + tourType);

      for (var tour in tours) {
        configuredTour.push(tours[tour][tourType]);
      }

      configuredTour = _.flatten(configuredTour);

      return configuredTour;

  }

  $log.info($window);

  return {
    getSteps: getSteps
  };

}
}());
