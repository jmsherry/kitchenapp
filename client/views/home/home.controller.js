(function(){
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('HomeCtrl', function () {

      var vm = this;

      angular.extend(vm, {
        name: 'HomeCtrl'
      });

    });
}());
