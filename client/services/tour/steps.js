(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .factory('TourSteps', TourSteps);

  TourSteps.$inject = ['$log', '$', '_', '$state'];

  function TourSteps($log, _, $, $state) {

    function getSteps() {
      return [{
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
        onNext: function (tour) {},
        onPrev: function (tour) {},
        onPause: function (tour) {},
        onResume: function (tour) {},
        onRedirectError: function (tour) {}
      },{
        element: ".nav.navbar-nav li:first-child a",
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
        onShow: function (tour) {
          $log.log('now');
          $state.go('food-calendar');
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

    return {
      getSteps: getSteps
    };

  }
}());
