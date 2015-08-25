(function(){
  'use strict';

  angular.module('kitchenapp')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['Auth', '$location'];

  function ProfileCtrl(Auth, $location) {

  	Auth.checkAuthorised();

  	var vm = this, user = Auth.getUser();

  	angular.extend(vm, {
  	  name: 'ProfileCtrl',
  	  user: user
  	});

  }
}());
