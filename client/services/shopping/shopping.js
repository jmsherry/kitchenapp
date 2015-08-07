(function () {
    'use strict';

    angular.module('kitchenapp')
        .service('Shopping', Shopping);

    Shopping.$inject = ['$q', '$resource', 'Auth', 'Ingredients', 'toastr', 'Cupboard', '$log', '$injector'];

    function Shopping($q, $resource, Auth, Ingredients, toastr, Cupboard, $log, $injector) {

        this.deferred = $q.defer();
        var _shopping = this.deferred.promise;

        this.getShopping = function getShopping() {
            return _shopping;
        };

        this.setShopping = function setShopping(shopping) {
            _shopping = shopping;
        };

        this.getOwner = function getOwner() {
            return Auth.getUser();
        };

        this.toastr = toastr;
        this.$resource = $resource;
        this.Ingredients = Ingredients;
        this.$q = $q;
        this.$log = $log;
        this.Cupboard = Cupboard;
        this.Auth = Auth;
        this.$injector = $injector;

        this.init();

    }

    /**
     * init
     *
     * Gets the shopping from server and saves to local
     *
     **/

    Shopping.prototype.init = function init() {

        var self = this,
            user = self.getOwner(),
            shopping;


            self.$log.log('shopping init');

        shopping = self.$resource('/api/users/:userid/shopping', {
                userid: user._id
            })
            .get(function (shopping) {
              var contents = self.populate(shopping.contents);
              shopping.contents = contents;
              self.deferred.resolve(shopping);
            });
    };

    Shopping.prototype.populate = function populate(items){
      var self = this, i, len = items.length;
      for (i = 0; i < len; i+=1) {
        items[i].ingredient = self.Ingredients.getById(items[i].ingredient);
      }
      return items;
    };

    /**
     * get
     *
     * Returns a local version of the Shopping
     *
     **/
    Shopping.prototype.get = function get() {
        var self = this;
        return self.getShopping();
    };


    /**
     * add
     *
     * @param ingredient item{}
     * Adds an ingredient to the ingredients array
     *
     */
    Shopping.prototype.add = function add(ing, meal) {
        var self = this,
            userid;

            self.$log.log('Shopping service add', arguments);

        delete(ing.$$hashKey);
        userid = self.getOwner()._id;

        function CBSuccess(ing, item, meal) {
            item.ingredient = ing
            item.reservedFor = meal;
            self.addLocal(item);
        }

        function CBError(ing, err) {
          self.$log.log(arguments);
            self.toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
        }

        self.$resource('/api/users/:userid/shopping', {
                userid: userid
            })
            .save({
                ing: ing._id,
                reservedFor: meal._id
            }, _.bind(CBSuccess, self, ing, meal), _.bind(CBError, self, ing, meal));

    };

    Shopping.prototype.bulkAdd = function bulkAdd(items, meal) {
      var self = this;
      $.each(items, function(i, item){
        self.add(item, meal);
      });
    };

    /**
     * update
     *
     * @param ingredient item {}
     * Updates an item in the user's shopping
     *
     */

    // Shopping.prototype.update = function update(item) {
    //     var self = this,
    //         userid;
    //
    //     userid = self.getOwner()._id;
    //
    //     function CBSuccess() {
    //         self.updateLocal(item);
    //     }
    //
    //     self.$resource('/api/users/:userid/shopping', {
    //             userid: userid
    //         }, {
    //             update: {
    //                 method: 'PUT',
    //                 isArray: true
    //             }
    //         })
    //         .update({
    //             item: item
    //         }, _.bind(CBSuccess, self, item));
    //
    // };

    /**
     * remove
     *
     * @param ingredient {}
     * Removes an ingredient from the ingredients array
     *
     */

    Shopping.prototype.remove = function remove(item) {

        var self = this,
            userid;

            self.$log.log('IN Shopping remove: ', item);

        userid = self.getOwner()._id;

        function CBSuccess() {
            self.$log.log('removed shopping item, removing locally', item);
            self.removeLocal(item);
        }

        self.$resource('/api/users/:userid/shopping/:itemid', {
            userid: userid,
            itemid: item._id
        }).remove(_.bind(CBSuccess, self, item));

    };

    Shopping.prototype.bulkRemove = function bulkRemove (items) {
      var self = this;
      _.forEach(items, function(item){
        self.remove(item);
      });

      return items;
    };


    Shopping.prototype.process = function process(idsArray) {
        var self = this,
            presentIngredients = [],
            missingIngredients = [],
            shopping = self.getShopping();

            self.$q.when(shopping, function(data){
              _.forEach(idsArray, function (thisIngID) {
                  if (data.contents.indexOf(thisIngID) === -1) {
                      missingIngredients.push(thisIngID);
                  } else {
                      presentIngredients.push(thisIngID);
                  }
              });


              return {
                  present: presentIngredients,
                  missing: missingIngredients
              };
        });
    };

    Shopping.prototype.addLocal = function addLocal(item) {
        var self = this,
            shopping;

        shopping = self.getShopping();

        self.$q.when(shopping, function (data) {
            var items = data.contents;
            items.push(item);
            self.toastr.success(item.ingredient.name + ' has been added to your shopping');
        });

    };

    // Shopping.prototype.updateLocal = function updateLocal(item) {
    //     var self = this,
    //         shopping, oldItem;
    //
    //     shopping = self.getShopping();
    //
    //     this.$q.when(shopping, function (data) {
    //       var items = data.contents;
    //         oldItem = _.find(data, {
    //             _id: item._id
    //         });
    //         oldItem = item;
    //
    //         self.setShopping(data);
    //         self.toastr.success(item.ingredient.name + ' has been added to your shopping');
    //     });
    // };

    Shopping.prototype.removeLocal = function removeLocal(item) {
        var self = this, shopping, name;

        //adjust for wrappers - Maybe convert to shopping list items
        if(item.ingredient && item.ingredient.name){
          name = item.ingredient.name;
        } else {
          name = item.name;
        }

        shopping = self.getShopping();

        self.$q.when(shopping, function (data) {
            var items = data.contents;
            items.splice(items.indexOf(item), 1);
            self.toastr.success(name + ' has been removed from your shopping');
        });

    };


    /**
     * buy
     *
     * @param ingredient item{}
     * Buys an ingredient to the ingredients array
     *
     */
    Shopping.prototype.buy = function buy(item) {


        var self = this,
        $deferred = self.$q.defer(), user, added;

        self.$log.log('buying', item);

        user = self.Auth.getUser(); //add budgeting logic next
        self.remove(item);

        added = self.Cupboard.add(item);

        self.$q.when(added, function(data){
          $deferred.resolve(data);
        });


        return $deferred.promise;
    };

}());
