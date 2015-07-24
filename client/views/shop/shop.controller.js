'use strict';

angular.module('kitchenapp')
  .controller('ShopCtrl', ShopCtrl);

ShopCtrl.$inject = ['Shopping', 'Auth', '$q'];

  function ShopCtrl(Shopping, Auth, $q) {

    Auth.checkAuthorised();

    var vm = this,
    items = Shopping.get();

    console.log(items);

    function buy(item){
      console.log('Buying ', item);
      Shopping.buy(item);
    }

    function remove(item){
      console.log('Removing ', item);
      Shopping.remove(item);
    }

    $q.when(items, function(data){
      vm.items = data.contents;
    });

    angular.extend(vm, {
      name: 'ShopCtrl',
      buy: buy,
      remove: remove
    });

  }
