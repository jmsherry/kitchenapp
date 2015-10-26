(function () {
  'use strict';

  //var thisYear = ;

  angular.module('kitchenapp.directives')
    .controller('KaFooterCtrl', ['$rootScope', '$scope', '$q', '$log', '$modal', 'Email', 'Auth', 'toastr', '$translate', 'LANGUAGES', 'tmhDynamicLocale', 'LOCALES', function ($rootScope, $scope, $q, $log, $modal, Email, Auth, toastr, $translate, LANGUAGES, tmhDynamicLocale, LOCALES) {
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
        event.preventDefault();
        event.stopPropagation();
      }

      function reviewSettings() {

        $log.log('reviewSettings fn', arguments);

        $modal.open({
          templateUrl: '/views/modals/settings-modal.html',
          controller: function modalController($modalInstance, $scope) {

            $scope.vm = {
              languages: LANGUAGES,
              lang: vm.currentLang,
              locales: LOCALES,
              locale: vm.currentLocale,
              updateLanguage: function updateLanguage() {
                var langKey = $scope.vm.lang;
                $log.log('updating language to: ', langKey);
                $translate.use(langKey);
                $rootScope.$broadcast('langChange', {
                  langKey: langKey
                });
                event.preventDefault();
                event.stopPropagation();
              },
              updateLocale: function updateLocale() {
                var localeKey = $scope.vm.locale;
                $log.log('updating locale to: ', localeKey);
                tmhDynamicLocale.set(localeKey);
                $rootScope.$broadcast('localeChange', {
                  localeKey: localeKey
                });
                event.preventDefault();
                event.stopPropagation();
              }
            };

          },
          contollerAs: 'vm'
        });
        event.preventDefault();
        event.stopPropagation();

      }



      $user = Auth.getUser();
      $q.when($user, function (user) {
        vm.user = user;
      });

      angular.extend(vm, {
        date: new Date(),
        email: {},
        currentLang: $translate.use(),
        currentLocale: tmhDynamicLocale.get(),
        contact: contact,
        reviewSettings: reviewSettings,
        name: 'KaFooterCtrl'
      });

    }])
    .directive('kaFooter', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/footer/footer.html',
        scope: {
          companyName: '@'
        },
        controller: 'KaFooterCtrl as vm',
        bindToController: true
      };
    });
}());
