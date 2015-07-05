'use strict';

angular.module('kitchenapp')
  .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$location', 'Auth'];

  function LoginCtrl($location, Auth) {
console.log(arguments);
    var vm = this;

    angular.extend(vm, {

      name: 'LoginCtrl',

      /**
       * Login method
       */
      login: function () {
        Auth.login(vm.user)
          .then(function () {
            $location.path('/');
            console.log(Auth.isLogged());

          })
          .catch(function (err) {
            vm.error = err;
          });
      }

    });

  }
