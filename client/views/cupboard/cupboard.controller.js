'use strict';

angular.module('kitchenapp')
  .controller('CupboardCtrl', CupboardCtrl);

CupboardCtrl.$inject = ['Cupboard', 'Auth', '$q', '$filter', 'Meals', '$modal', '$log'];

  function CupboardCtrl(Cupboard, Auth, $q, $filter, Meals, $modal, $log) {

  	Auth.checkAuthorised();

    var vm = this,
    cupboard = Cupboard.get();


    $q.when(cupboard, function(data){

          $log.log('HERERERERE', data, Meals);
          var i, len = data.length, thisItem, theseItems = [], meals, reservedForPromise;

          for(i=0;i<len;i+=1){
            thisItem = data[i];
            $log.log(thisItem);
            if(typeof thisItem.reservedFor === 'string'){
              reservedForPromise = Meals.getMealById(thisItem.reservedFor); //returns a promise
              $log.log(thisItem);
              theseItems.push(reservedForPromise);
            }
          }

          $q.all(theseItems).then(function(fullData){
            var thisItem, reservedForMeal;
            $log.log('all called', fullData);
            for(i=0;i<len;i+=1){
              thisItem = data[i];
              if(thisItem.reservedFor && typeof thisItem.reservedFor === 'string'){
                thisItem.reservedFor = _.find(fullData, {_id: thisItem.reservedFor});
              }
            }

            vm.items = data;
          });


      meals = Meals.get();
      $q.when(meals, function(mealsData){
        vm.meals = mealsData;
      });


    });

    function remove(item){
      Cupboard.remove(item);
    }

    function toggleEdit(){
      vm.editing = !vm.editing;
    }

    function sortBy(predicate){
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

    function unreserve(item){
      $log.log("unreserve", arguments);
      item.reservedFor = null;
      Cupboard.update(item);
    }

    function showReserveModal(item){
      $log.log("manuallyReserve", arguments);
      var self = this;
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

    function reserve(item, meal){
      $log.log('reserving', arguments, this);
      Cupboard.reserve(item, meal._id);
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
