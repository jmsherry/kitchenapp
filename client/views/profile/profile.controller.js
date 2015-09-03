(function(){
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['Auth'];

  function ProfileCtrl(Auth) {

  	Auth.checkAuthorised();

  	var vm = this, user = Auth.getUser();

  	angular.extend(vm, {
  	  name: 'ProfileCtrl',
  	  user: user
  	});

  }
}());
