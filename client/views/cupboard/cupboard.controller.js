'use strict';

angular.module('kitchenapp')
  .controller('CupboardCtrl', CupboardCtrl);

CupboardCtrl.$inject = ['Cupboard', 'Auth', '$q'];

  function CupboardCtrl(Cupboard, Auth, $q) {

  	Auth.checkAuthorised();

    var vm = this,
    cupboard = Cupboard.get();

    $q.when(cupboard, function(data){
      console.log('HERERERERE', data);
      vm.items = data.contents;
    });

    function remove(item){
      Cupboard.remove(item)
    }

    function toggleEdit(){
      vm.editing = !vm.editing;
    }

    angular.extend(vm, {
      name: 'CupboardCtrl',
      editing: false,
      remove: remove,
      toggleEdit: toggleEdit
    });

  }
