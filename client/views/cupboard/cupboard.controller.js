'use strict';

angular.module('kitchenapp')
  .controller('CupboardCtrl', CupboardCtrl);

CupboardCtrl.$inject = ['Cupboard', 'Auth'];

  function CupboardCtrl(Cupboard, Auth) {

  	Auth.checkAuthorised();

    var vm = this,
    user = Auth.getUser();


    angular.extend(vm, {
      name: 'CupboardCtrl',
      cupboardItems: user.cupboard
    });

  }
