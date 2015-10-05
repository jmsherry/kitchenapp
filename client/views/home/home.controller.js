(function () {
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$modal', '$log', 'Tour', 'TourSteps', 'Auth', '$q', '$', '$timeout', '$window'];

  function HomeCtrl($modal, $log, Tour, TourSteps, Auth, $q, $, $timeout, $window) {

    var vm = this,
      $user = Auth.getUser();

    $q.when($user, function (user) {
      vm.user = user;
      if (!user.inducted) {
        $timeout(function () {
          $('#introVideoBtn').click();
        });
      }
    });

    // Instance the tour
    var tour = new Tour({
      name: "tour",
      steps: TourSteps.getSteps(),
      container: "body",
      keyboard: true,
      storage: $window.localStorage,
      debug: true,
      backdrop: false,
      backdropContainer: 'body',
      backdropPadding: 0,
      animation: true,
      redirect: true,
      orphan: false,
      duration: false,
      delay: false,
      basePath: "",
      template: '<div class="popover tour"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-navigation"><button class="btn btn-default" data-role="prev">« Prev</button><span data-role="separator">|</span><button class="btn btn-default" data-role="next">Next »</button></div><button class="btn btn-default" data-role="end">End tour</button></nav></div>',
      afterGetState: function (key, value) {},
      afterSetState: function (key, value) {},
      afterRemoveState: function (key, value) {},
      onStart: function (tour) {},
      onEnd: function (tour) {},
      onShow: function (tour) {},
      onShown: function (tour) {},
      onHide: function (tour) {},
      onHidden: function (tour) {},
      onNext: function (tour) {},
      onPrev: function (tour) {},
      onPause: function (tour, duration) {},
      onResume: function (tour, duration) {},
      onRedirectError: function (tour) {}
    });

    $log.log(tour);

    function takeTour() {
      $log.log(tour);
      // Initialize the tour
      tour.init();

      // Start the tour
      tour.start();
    }

    function introVideo() {
      $log.log('introVideo');
      $modal.open({
        templateUrl: '/views/modals/intro-modal.html',
        controller: function ($modalInstance, $scope) {
          $scope.inductUser = function inductUser() {
            if (!vm.user.inducted) {
              vm.user.inducted = true;
              Auth.updateUser(vm.user);
            }
            $modalInstance.close();
          };
          $scope.user = vm.user;
        }
      });
    }

    angular.extend(vm, {
      name: 'HomeCtrl',
      introVideo: introVideo,
      takeTour: takeTour
    });

  }

}());
