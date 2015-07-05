'use strict';

angular.module('kitchenapp')
  .controller('CupboardCtrl', CupboardCtrl);

CupboardCtrl.$inject = ['Meals', 'Auth'];

  function CupboardCtrl(Meals, Auth) {

  	Auth.checkAuthorised();

    var vm = this,
    user = Auth.getUser();

    console.log(user);



    angular.extend(vm, {
      name: 'CupboardCtrl',
      cupboardItems: user.cupboard
    });

  }
