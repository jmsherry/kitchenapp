'use strict';

angular.module('kitchenapp')
  .controller('CupboardCtrl', CupboardCtrl);

CupboardCtrl.$inject = ['Cupboard', 'Auth', '$q', '$filter', 'Meals', '$modal', '$log'];

  function CupboardCtrl(Cupboard, Auth, $q, $filter, Meals, $modal, $log) {

  	Auth.checkAuthorised();

    var vm = this,
    cupboard = Cupboard.get();


    $q.when(cupboard, function(data){

      if(!Cupboard.initialised){
          $log.log('HERERERERE', data, Meals);
          var i, len = data.contents.length, thisItem, theseItems = [], meals;

          for(i=0;i<len;i+=1){
            thisItem = data.contents[i];
            $log.log(thisItem);
            thisItem = Meals.getMealById(thisItem.reservedFor); //returns a promise
            $log.log(thisItem);
            theseItems.push(thisItem);
          }

          $q.all(theseItems).then(function(fullData){
            var thisItem, reservedForMeal;
            $log.log('all called', fullData);
            for(i=0;i<len;i+=1){
              thisItem = data.contents[i];
              reservedForMeal = fullData[i];
              $log.log(fullData[i]);

              if(reservedForMeal){
                thisItem.reservedFor = reservedForMeal;
              } else {
                thisItem.reservedFor = null;
              }
            }

            vm.items = data.contents;
          });

        } else {
          vm.items = data.contents;
        }

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
      $log.log('in sortBy: ', vm.items);
      switch (predicate) {
        case 'name':
          vm.items = _.sortByOrder(vm.items, ['item.ingredient.name'], ['asc']);
          $log.log('sorted: ', vm.items);
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
