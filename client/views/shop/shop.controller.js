'use strict';

angular.module('kitchenapp')
  .controller('ShopCtrl', ShopCtrl);

ShopCtrl.$inject = ['Shopping', 'Auth'];

  function ShopCtrl(Shopping, Auth) {

    Auth.checkAuthorised();

    var vm = this,
    items = Shopping.get();

    console.log(items);

    function buy(item){
      console.log(item);
      Shopping.buy(item);
    }


    angular.extend(vm, {
      name: 'InventoryCtrl',
      buy: buy,
      items: items
    });

  }
