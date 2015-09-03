(function(){
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('SignupCtrl', function ($location, Auth, toastr) {

      var vm = this;

      // vm.fields = [
      //   {
      //     className: 'row',
      //     fieldGroup: [
      //       {
      //         className: 'col-xs-6',
      //         type: 'input',
      //         key: 'firstName',
      //         templateOptions: {
      //           label: 'First Name'
      //         }
      //       },
      //       {
      //         className: 'col-xs-6',
      //         type: 'input',
      //         key: 'lastName',
      //         templateOptions: {
      //           label: 'Last Name'
      //         },
      //         expressionProperties: {
      //           'templateOptions.disabled': '!model.firstName'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     template: '<hr /><div><strong>Address:</strong></div>'
      //   },
      //   {
      //     className: 'row',
      //     fieldGroup: [
      //       {
      //         className: 'col-xs-6',
      //         type: 'input',
      //         key: 'street',
      //         templateOptions: {
      //           label: 'Street'
      //         }
      //       },
      //       {
      //         className: 'col-xs-3',
      //         type: 'input',
      //         key: 'cityName',
      //         templateOptions: {
      //           label: 'City'
      //         }
      //       },
      //       {
      //         className: 'col-xs-3',
      //         type: 'input',
      //         key: 'zip',
      //         templateOptions: {
      //           type: 'number',
      //           label: 'Zip',
      //           max: 99999,
      //           min: 0,
      //           pattern: '\\d{5}'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     template: '<hr />'
      //   },
      //   {
      //     type: 'input',
      //     key: 'otherInput',
      //     templateOptions: {
      //       label: 'Other Input'
      //     }
      //   },
      //   {
      //     type: 'checkbox',
      //     key: 'otherToo',
      //     templateOptions: {
      //       label: 'Other Checkbox'
      //     }
      //   }
      // ];

      angular.extend(vm, {

        name: 'SignupCtrl',

        /**
         * Signup
         */
        signup: function () {
          Auth.signup(vm.user)
            .then(function () {
              $location.path('/');
            })
            .catch(function (err) {
              if(err.errors && err.errors.email && err.errors.email.property && err.errors.email.property.type === "user defined"){
                toastr.error('That email is already registerd with us.');
              }
              vm.error = err;
            });
        }

      });

    });
}());
