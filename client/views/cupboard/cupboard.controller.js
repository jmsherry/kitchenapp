'use strict';

angular.module('kitchenapp')
  .controller('CupboardCtrl', CupboardCtrl);

CupboardCtrl.$inject = ['Cupboard', 'Auth', '$q', '$filter'];

  function CupboardCtrl(Cupboard, Auth, $q, $filter) {

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

    function sortBy(predicate){
console.log('in sortBy: ', vm.items);
      switch (predicate) {
        case 'name':
          vm.items = _.sortByOrder(vm.items, ['item.ingredient.name'], ['asc']);
          console.log('sorted: ', vm.items);
          break;
        case 'dateAdded':
          vm.items = _.sortByOrder(vm.items, ['item.dateAdded'], ['asc']);
          break;
        case 'reservation':
          vm.items = _.sortByOrder(vm.items, ['reservedFor.date'], ['asc']);
          break;
        default:
          $filter('orderBy')(vm.items, 'item.dateAdded', false);
          break;
      }

      vm.predicate = predicate;

    }

    angular.extend(vm, {
      name: 'CupboardCtrl',
      editing: false,
      remove: remove,
      toggleEdit: toggleEdit,
      sortBy: sortBy,
      predicate: '',
      reverse: false
    });

  }
