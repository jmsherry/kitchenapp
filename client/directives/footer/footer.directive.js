(function () {
  'use strict';

  //var thisYear = ;

  angular.module('kitchenapp.directives')
    .controller('KaFooterCtrl', ['$scope', '$q', '$log', '$modal', 'Email', 'Auth', 'toastr', function ($scope, $q, $log, $modal, Email, Auth, toastr) {
      var vm = this,
        $user;

      function contact(day) {
        $log.log('contact fn', arguments);

        $modal.open({
          templateUrl: '/views/modals/contact-modal.html',
          controller: function modalController($modalInstance, $scope) {
            $scope.vm = this;
            $scope.vm.email = vm.email;
            $scope.vm.user = vm.user;
            $scope.vm.sendMessage = function () {
              $modalInstance.close();
              $q.when(vm.user, function (user) {
                var $emailSent = Email.sendEmail(vm.email, vm.user);
                $q.when($emailSent, function (res) {
                  toastr.success('Email sent! Thank you for your interest...');

                }, function () {
                  toastr.error('We\'re sorry your email hasn\'t been sent, please try again later...');
                });
              });
              event.preventDefault();
              event.stopPropagation();
            };
          },
          contollerAs: 'vm'
        });

      }

      vm.year = new Date().getFullYear();
      vm.email = {};

      $user = Auth.getUser();
      $q.when($user, function (user) {
        vm.user = user;
      });

      vm.contact = contact;
      vm.name = 'KaFooterCtrl';
    }])
    .directive('kaFooter', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/footer/footer.html',
        scope: {
          companyName: '@',
          companyEmail: '@'
        },
        controller: 'KaFooterCtrl as vm',
        bindToController: true
      };
    });
}());
