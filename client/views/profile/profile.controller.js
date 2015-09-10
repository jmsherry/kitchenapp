(function(){
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['Auth', '$q', '$scope'];

  function ProfileCtrl(Auth, $q, $scope) {

  	Auth.checkAuthorised();

  	var vm = this, user = Auth.getUser();
vm.user = user;
    $q.when(user, function(usr){
      console.log(usr);
      vm.user = usr;
    });

  	angular.extend(vm, {
  	  name: 'ProfileCtrl'
  	});

  }
}());
