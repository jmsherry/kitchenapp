(function () {
    'use strict';

    angular.module('kitchenapp.controllers')
        .controller('ShopCtrl', ShopCtrl);

    ShopCtrl.$inject = ['Shopping', 'Auth', '$q', 'Meals', '$log', 'Cupboard', 'toastr'];

    function ShopCtrl(Shopping, Auth, $q, Meals, $log, Cupboard, toastr) {

        Auth.checkAuthorised();

        var vm = this,
            items = Shopping.get(),
            $meals = Meals.get();

        $q.when(items, function (SL) {
          if(!SL){
            vm.items = [];
            $log.warn('SL not correct', SL);
            toastr.error('Error retrieving shopping list!');
          } else {
            vm.items = SL;
          }
        });

        $q.when($meals, function (meals) {
          if(!meals){
            vm.meals = [];
            $log.warn('Meals not correct', meals);
            toastr.error('Error retrieving meals list!');
          } else {
            vm.meals = meals;
          }
        });


        function buy(item) {
            // Buy it and remove from shopping list
            $log.log('Buying ', item);
            var bought = Shopping.buy(item);

            $q.when(bought, function (boughtItem) {
                $log.log('bought', boughtItem);
                //Add it to the cupboard
                var addedToCupboard = Cupboard.add(boughtItem, true); //true indicates it was bought not acquired
                $q.when(addedToCupboard, function (cupboardItem) {

                  // Now tell meals service that you've bought it so meals can be updated
                  if (cupboardItem.reservedFor) {
                      Meals.itemBought(boughtItem, cupboardItem);
                  }

                });
            });
        }

        function remove(item) {
            Shopping.remove(item);
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
            vm.items = _.sortByOrder(vm.items, ['reservedFor._id'], ['asc']);
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

        angular.extend(vm, {
            name: 'ShopCtrl',
            buy: buy,
            remove: remove,
            predicate: '',
            reverse: false,
            sortBy: sortBy
        });

    }
}());
