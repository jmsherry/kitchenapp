(function () {
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['Auth', '$q', '$scope', '$log', '$rootScope', 'toastr'];

  function ProfileCtrl(Auth, $q, $scope, $log, $rootScope, toastr) {

    Auth.checkAuthorised();

    var vm = this, $user = Auth.getUser();

    function editBudget(edit){
      vm.editingBudget = edit;
      event.stopPropagation();
    }

    function editEmail(edit){
      vm.editingEmail = edit;
      event.stopPropagation();
    }

    function updateProfile(){
      $log.log('new user data', vm.user);
      Auth.updateUser(vm.user);
      vm.editingEmail = false;
      vm.editingBudget = false;
    }

    $q.when($user, function (user) {
      $log.log(user);
      vm.user = user;
    });

    angular.extend(vm, {
      name: 'ProfileCtrl',
      editingBudget: false,
      editingEmail: false,
      editEmail: editEmail,
      editBudget: editBudget,
      updateProfile: updateProfile
    });

  }
}());
