(function () {
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('CupboardCtrl', CupboardCtrl);

  CupboardCtrl.$inject = ['Cupboard', 'Shopping', 'Auth', '$q', '$filter', 'Meals', '$modal', '$log', '_', '$'];

  function CupboardCtrl(Cupboard, Shopping, Auth, $q, $filter, Meals, $modal, $log, _, $) {

    Auth.checkAuthorised();

    var vm = this,
      cupboard, meals;
    vm.loading = true;

    cupboard = Cupboard.get();
    $q.when(cupboard, function (cupboardItems) {
      vm.items = cupboardItems;
      vm.loading = false;
    });

    meals = Meals.get();
    $q.when(meals, function (mealsData) {
      vm.meals = mealsData;
    });

    function remove(item) {
      var $removed = Cupboard.remove(item);
      $q.when($removed, function (removed) {
        if (item.reservedFor) {
          Shopping.add(item.ingredient, item.reservedFor);
        }
      });
    }

    function toggleEdit() {
      vm.editing = !vm.editing;
    }

    function sortBy(predicate) {
      $log.log('in sortBy: ', vm.items, predicate);
      switch (predicate) {
      case 'name':
        $log.log('pre-sort name: ', vm.items);
        vm.items = _.sortByOrder(vm.items, ['ingredient.name'], ['asc']);
        $log.log('sorted: ', vm.items);
        break;
      case 'dateAdded':
        $log.log('pre-sort dateAdded: ', vm.items);
        vm.items = _.sortByOrder(vm.items, ['dateAdded'], ['asc']);
        $log.log('sorted: ', vm.items);
        break;
      case 'reservation':
        $log.log('pre-sort reservation: ', vm.items);
        vm.items = _.sortByOrder(vm.items, ['reservedFor.date'], ['asc']);
        $log.log('sorted: ', vm.items);
        break;
      default:
        $log.log('pre-sort default name: ', vm.items);
        $filter('orderBy')(vm.items, 'dateAdded', false);
        $log.log('sorted: ', vm.items);
        break;
      }

      vm.predicate = predicate;
    }

    // Unreserving
    function unreserve(item) {
      $log.log("unreserve", arguments);
      Meals.unreserveItem(item);
    }

    // Reserving
    function showReserveModal(item) {
      $log.log("manuallyReserve", arguments);

      vm.selectedItem = item;

      var modal = $modal.open({
        templateUrl: '/views/modals/cupboard-manually-reserve.html',
        controller: function modalController($scope, $modalInstance) {
          $log.log('modal controller running', arguments);
          $scope.$modalInstance = $modalInstance;
          //$scope.action = action;
          $scope.item = vm.selectedItem;
          $scope.pendingMeals = vm.meals.pending;
          $log.log('modal scope', $scope);
          $scope.reserve = vm.reserve;
          $scope.modal = modal;

        }
      });
    }

    function reserve(item, meal) {
      var $reserved;
      $log.log('reserving', arguments, this);
      $reserved = Cupboard.reserve(item, meal);
      $q.when($reserved, function (reservedItem) {
        Meals.obtainItem(meal);
      });
    }

    angular.extend(vm, {
      name: 'CupboardCtrl',
      editing: false,
      remove: remove,
      toggleEdit: toggleEdit,
      sortBy: sortBy,
      predicate: '',
      reverse: false,
      unreserve: unreserve,
      showReserveModal: showReserveModal,
      reserve: reserve,
      selectedItem: null
    });

  }
}());
