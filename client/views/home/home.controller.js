'use strict';

angular.module('kitchenapp')
  .controller('HomeCtrl', function (Auth) {

    var vm = this;

    angular.extend(vm, {
      name: 'HomeCtrl'
    });

  });
