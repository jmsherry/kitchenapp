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
            .query(function (shopping) {
              self.$q.when(shopping, function(data){
                data = self.populate(data);
                self.deferred.resolve(data);
              });
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
     * @param meal {} (optional)
     * The meal that the ingredient is reserved for
     *
     */
    Shopping.prototype.add = function add(ing, meal) {
        var self = this,
            userid, reservedFor = null;

            if(meal){
              reservedFor = meal._id;
            }

            self.$log.log('Shopping service add', arguments);


        userid = self.getOwner()._id;

        function CBSuccess(ing, meal, item) {
            //item = item.toJSON();
            item.ingredient = ing
            if(meal){
              item.reservedFor = meal;
            }
            self.addLocal(item);
        }

        function CBError(ing, meal, err) {
          self.$log.log(arguments);
            self.toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
        }

        self.$resource('/api/users/:userid/shopping', {
                userid: userid
            })
            .save({
                ing: ing._id,
                reservedFor: reservedFor
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
    //     function CBSuccess(item, response) {
    //         self.updateLocal(response);
    //     }
    //
    //     self.$resource('/api/users/:userid/shopping', {
    //             userid: userid
    //         }, {
    //             update: {
    //                 method: 'PUT'
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

    Shopping.prototype.handleMealDelete = function handleMealDelete (meal) {
      var self = this, idsArray = [], shoppingList = self.getShopping(), mealId = meal._id;

      self.$q.when(shoppingList, function(SL){
        _.forEach(SL, function(item){
          if(item.reservedFor._id === mealId){
            self.remove(item);
          }
        });
      });


      return meal;
    };


    Shopping.prototype.process = function process(idsArray) {
        var self = this,
            presentIngredients = [],
            missingIngredients = [],
            shopping = self.getShopping();

            self.$q.when(shopping, function(data){
              _.forEach(idsArray, function (thisIngID) {
                  if (data.indexOf(thisIngID) === -1) {
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
            var items = data;
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
    //       var items = data;
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
            var items = data;
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
        deferred = self.$q.defer(), user, added;

        self.$log.log('buying', item);

        user = self.Auth.getUser(); //add budgeting logic next
        self.remove(item);

        added = self.Cupboard.add(item, true); //true indicates that it was bought not acquired.

        self.$q.when(added, function(data){
          deferred.resolve(data);
        });


        return deferred.promise;
    };

    Shopping.prototype.getPurchases = function getPurchases(){
      var self = this,
          user = self.getOwner(),
          deferred = self.$q.defer();


          self.$log.log('shopping init');

          self.$resource('/api/users/:userid/purchases', {
              userid: user._id
          })
          .query(function (purchases) {
            self.$q.when(purchases, function(data){
              deferred.resolve(data);
            });
          });

          return deferred.promise;
    };

    Shopping.prototype.getBudgetInformation = function getBudgetInformation(date){

        var self = this, deferred, startOfWeek, endOfWeek, remValues = [], spentValues = [], dayObj = {},
        budget = self.Auth.getUser().budget, AmountSpent, data;

        data = self.getPurchases();
        deferred = self.$q.defer();

        self.$q.when(data, function(purchaseData){
          console.log('purchaseData', purchaseData);
          startOfWeek = moment(date).startOf('isoweek');
          endOfWeek = moment(date).endOf('isoweek');

          console.log(startOfWeek, endOfWeek);

          for(var i=0; i < 7; i+=1){
            dayObj.x = startOfWeek.add(i, 'd');
            remValues.push(dayObj);
            spentValues.push(dayObj);
          }

          for(var i=0; i < 7; i+=1){
            remValues[i].y = budget - AmountSpent;
            remValues[i].series = 0
            spentValues[i].y = AmountSpent;
            spentValues[i].series = 1;
          }

          deferred.resolve([{
              "key": "Remaining Budget",
              "values": remValues
            }, {
              "key": 'Amount Spent so far',
              "values": spentValues
            }]);
        });

        return deferred.promise;

    };

}());
