'use strict';

angular.module('kitchenapp')
  .controller('ShopCtrl', ShopCtrl);

ShopCtrl.$inject = ['Shopping', 'Auth', '$q', 'Meals', '$log'];

  function ShopCtrl(Shopping, Auth, $q, Meals, $log) {

    Auth.checkAuthorised();

    var vm = this,
    items = Shopping.get(),
    meals = Meals.get();

    $log.log(items);

    function buy(item){
      $log.log('Buying ', item);
      var bought = Shopping.buy(item);
      $log.log('bought', bought);
      $q.when(bought, function(data){
        if(item.reservedFor){
          Meals.itemBought(data);
        }
      });
    }

    function remove(item){
      $log.log('Removing ', item);
      Shopping.remove(item);
    }

    $q.when(items, function(data){
      $q.when(meals, function(mls){

        var item, len = data.length, i, ings = [];
        mls = mls.pending.concat(mls.complete);
        for(i = 0; i < len; i+=1){
          item = data[i];
          ings.push(item.ingredient);
          if(!item.reservedFor.name){
            item.reservedFor = _.find(mls, {_id: item.reservedFor});
          }
        }

        $q.all(ings).then(function(ingData){
          for(i=0; i<len; i+=1){
            data[i].ingredient = ingData[i];
          }
          vm.items = data;
        });

      });
    });

    angular.extend(vm, {
      name: 'ShopCtrl',
      buy: buy,
      remove: remove
    });

  }
