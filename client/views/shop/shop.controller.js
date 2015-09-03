(function () {
    'use strict';

    angular.module('kitchenapp.controllers')
        .controller('ShopCtrl', ShopCtrl);

    ShopCtrl.$inject = ['Shopping', 'Auth', '$q', 'Meals', '$log', 'Cupboard', 'toastr'];

    function ShopCtrl(Shopping, Auth, $q, Meals, $log, Cupboard, toastr) {

        Auth.checkAuthorised();

        var vm = this,
            items = Shopping.get();

        $q.when(items, function (SL) {
          if(!SL){
            vm.items = [];
            $log.warn('SL not correct', SL);
            toastr.error('Error retrieving shopping list!')
          } else {
            vm.items = SL;
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
                  if (populatedItem.reservedFor) {
                      Meals.itemBought(cupboardItem);
                  }

                });
            });
        }

        function remove(item) {
            $log.log('Removing ', item);
            var removed = Shopping.remove(item);
            $q.when(removed, function(removedItem){
              vm.items.splice(vm.items.indexOf(removedItem, 1));
            });
        }

        angular.extend(vm, {
            name: 'ShopCtrl',
            buy: buy,
            remove: remove
        });

    }
}());
