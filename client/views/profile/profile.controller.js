(function () {
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['Auth', '$q', '$scope', '$log'];

  function ProfileCtrl(Auth, $q, $scope, $log) {

    Auth.checkAuthorised();

    var vm = this, $user = Auth.getUser();

    $q.when($user, function (user) {
      $log.log(user);
      vm.user = user;
    });

    angular.extend(vm, {
      name: 'ProfileCtrl'
    });

  }
}());
