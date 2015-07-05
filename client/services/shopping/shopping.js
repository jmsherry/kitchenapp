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
        var user = this.getOwner(),
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
          this.setShoppingList(fullList);
        })
    };

    Shopping.prototype.get = function get() {
        return this.getShoppingList();
    };

    Shopping.prototype.buy = function buy(item) {
        this.remove(item);
        Cupboard.add(item).then(this.successCallback, this.errorCallback, this.notifyCallback);
    };

    Shopping.prototype.add = function add(newIng) {
      var shoppingList = this.getShoppingList();
        shoppingList.push(newIng);
    };

    Shopping.prototype.remove = function remove(item) {
        var shoppingList = this.getShoppinglist(),
        i, length = shoppingList.length;

        for (i = 0; i < length; i += 1) {
            if (shoppingListL[i]._id === item._id) {
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
