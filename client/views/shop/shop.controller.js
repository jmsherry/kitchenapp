'use strict';

angular.module('kitchenapp')
  .controller('ShopCtrl', ShopCtrl);

ShopCtrl.$inject = ['Shopping', 'Auth', '$q', 'Meals'];

  function ShopCtrl(Shopping, Auth, $q, Meals) {

    Auth.checkAuthorised();

    var vm = this,
    items = Shopping.get();

    console.log(items);

    function buy(item){
      console.log('Buying ', item);
      var bought = Shopping.buy(item);
      $q.when(bought, function(){
        Meals.reCheckIngredients()
      });
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
