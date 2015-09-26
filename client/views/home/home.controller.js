(function () {
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$modal', '$log'];

  function HomeCtrl($modal, $log) {

    var vm = this;

    function takeTour() {

    }

    function introVideo() {
      $log.log('introVideo');
      $modal.open({
        templateUrl: '/views/modals/intro-modal.html',
        controller: function($modalInstance, $scope){
            
        }
      });
    }

    angular.extend(vm, {
      name: 'HomeCtrl',
      introVideo: introVideo,
      takeTour: takeTour
    });

  }

}());
