(function(){
    'use strict';

    angular.module('kitchenapp')
        .service('Shopping', Shopping);

    Shopping.$inject = ['$q', '$resource', 'Auth', 'Cupboard', 'toastr', 'Ingredients'];

    function Shopping($q, $resource, Auth, Cupboard, toastr, Ingredients) {

        var _SL = [],
            _resource = $resource('/api/shopping');

            this.getShoppingList = function getShoppingList () {
                return _SL;
            };

            this.setShoppingList = function setShoppingList (shoppingList) {
                _SL = shoppingList;
            };

            this.getResource = function getResource () {
                return _resource;
            };

            this.getOwner = function getOwner (){
              return Auth.getUser();
            };

            this.toastr = toastr;

    }

    Shopping.prototype.init = function init() {
        console.log('shopping list init');
        var self = this, user = self.getOwner(),
        shoppingList = user.shoppingList,
        fullList = [],
        ings;

        ings = Ingredients.get();
        $q.when(ings, function(){
          $.each(shoppingList, function(i, item){
            var fullItem;
            fullItem = _.find(ings, {_id: item._id});
            fullList.push(fullItem);
          });
          self.setShoppingList(fullList);
        })
    };

    Shopping.prototype.get = function get() {
        var self = this;
        return self.getShoppingList();
    };

    Shopping.prototype.buy = function buy(item) {
      var self = this;
        self.remove(item);
        Cupboard.add(item).then(self.successCallback, self.errorCallback, self.notifyCallback);
    };

    Shopping.prototype.bulkBuy = function bulkBuy(newIngs) {
      var self = this;
      $.each(newIngs, function(i, ing){
        self.buy(ing);
      });
    };

    Shopping.prototype.add = function add(newIng) {
      var self = this, shoppingList = self.getShoppingList();
        shoppingList.push(newIng);
    };

    Shopping.prototype.bulkAdd = function bulkAdd(newIngs) {
      var self = this;
      $.each(newIngs, function(i, ing){
        self.add(ing);
      });
    };

    Shopping.prototype.save = function save(ing){
      var self = this;
      self.getResource.delete(ing, function(){
        self.add(ing);
      });
    }

    Shopping.prototype.remove = function remove(item) {
        var self = this, shoppingList = self.getShoppingList(),
        i, length = shoppingList.length;

        for (i = 0; i < length; i += 1) {
            if (shoppingList[i]._id === item._id) {
                shoppingList.splice(i, 1);
                break;
            }
        }

    };

    Shopping.prototype.successCallback = function successCallback(msg) {
        toastr.success(msg);
    };

    Shopping.prototype.errorCallback = function errorCallback(msg) {
        toastr.error(msg);
    };

    Shopping.prototype.notifyCallback = function notifyCallback(msg) {
        toastr.info(msg);
    };
}());
