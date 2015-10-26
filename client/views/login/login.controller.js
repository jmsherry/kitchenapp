(function(){
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$location', 'Auth', 'toastr', '$stateParams', '$log', '$state', '$q'];

    function LoginCtrl($location, Auth, toastr, $stateParams, $log, $state, $q) {
  //console.log(arguments);
      var vm = this;

      angular.extend(vm, {

        name: 'LoginCtrl',
        messages: $stateParams.messages,

        login: function () {
          var loggedIn = Auth.login(vm.user);
          $q.when(loggedIn, function(user){
            $state.go('home');
          }, function(err){
            toastr.error('Unable to log in: ' + err.status);
          });
        }

      });

    }
}());
