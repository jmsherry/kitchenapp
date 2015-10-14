(function(){
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$location', 'Auth', 'toastr', '$stateParams', '$log'];

    function LoginCtrl($location, Auth, toastr, $stateParams, $log) {
  //console.log(arguments);
      var vm = this;

      angular.extend(vm, {

        name: 'LoginCtrl',
        messages: $stateParams.messages,

        /**
         * Login method
         */
        login: function () {
          Auth.login(vm.user)
            .then(function () {
              $location.path('/');
              $log.log('User logged in: ', Auth.isLogged());
            })
            .catch(function (err) {
              toastr.error('Error logging in ', err.msg);
            });
        }

      });

    }
}());
