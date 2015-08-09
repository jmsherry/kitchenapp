'use strict';

angular.module('kitchenapp')
  .controller('ShopCtrl', ShopCtrl);

ShopCtrl.$inject = ['Shopping', 'Auth', '$q', 'Meals'];

  function ShopCtrl(Shopping, Auth, $q, Meals) {

    Auth.checkAuthorised();

    var vm = this,
    items = Shopping.get(),
    meals = Meals.get();

    console.log(items);

    function buy(item){
      console.log('Buying ', item);
      var bought = Shopping.buy(item);
      $q.when(bought, function(){
        Meals.reCheckIngredients();
      });
    }

    function remove(item){
      console.log('Removing ', item);
      Shopping.remove(item);
    }

    $q.when(items, function(data){
      $q.when(meals, function(mls){
        var item, len = data.contents.length, i;
        mls = mls.pending.concat(mls.complete);
        for(i = 0; i < len; i+=1){
          item = data.contents[i];
          if(!item.reservedFor.name){
            item.reservedFor = _.find(mls, {_id: item.reservedFor});
          }
        }
        vm.items = data.contents
      });
    });

    angular.extend(vm, {
      name: 'ShopCtrl',
      buy: buy,
      remove: remove
    });

  }
