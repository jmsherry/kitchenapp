(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .service('Shopping', Shopping);

  Shopping.$inject = ['$q', '$resource', 'Auth', 'Ingredients', 'toastr', 'Cupboard', '$log', '$injector', '$', '_', 'moment'];

  function Shopping($q, $resource, Auth, Ingredients, toastr, Cupboard, $log, $injector, $, _, moment) {

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
    this._ = _;
    this.$ = $;
    this.moment = moment;

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
      owner = self.getOwner(),
      shopping;

          self.$log.log('shopping init');

    function successCB(shopping) {
      self.$q.when(shopping, function (data) {
        self.$log.log('shopping init SL returned: ', data);
        var populated = self.populate(data);
        self.$q.when(populated, function(fullData){
          self.deferred.resolve(fullData);
        });
      });
    }

    function errorCB(err){
      self.toastr.error(err.message);
      self.deferred.reject(err);
    }
    self.$q.when(owner, function(ownerData){
      shopping = self.$resource('/api/users/:userid/shopping/:itemid', {
          userid: ownerData._id,
          itemid: '@_id'
        })
        .query(self._.bind(successCB, self), self._.bind(errorCB, self));
    });
  };

  Shopping.prototype.populate = function populate(items) {
    var self = this,
      i, len = items.length, deferred = self.$q.defer(), promises = [], thisIng;

    if(self._.isPlainObject(items)){
      items = [items];
    } else if (!self._.isArray(items)) {
      throw new Error('Wrong type of argument passed to Shopping.populate');
    }

    for (i = 0; i < len; i += 1) {
      thisIng = items[i].ingredient;
      thisIng = self.Ingredients.getIngredientById(items[i].ingredient);
      promises.push(thisIng);
    }

    self.$q.all(promises).then(function(popdItems){
      for (i = 0; i < len; i += 1) {
        items[i].ingredient = popdItems[i];
      }
      deferred.resolve(items);
    });

    return deferred.promise;
  };

  /**
   * get
   *
   * Returns a local version of the Shopping List
   *
   **/
  Shopping.prototype.get = function get() {
    var self = this;
    return self.getShopping();
  };

  /**
   * add
   *
   * Adds an ingredient to the ShoppingList
   *
   * The ingredient
   * @param ingredient item {}
   *
   * The meal that the ingredient is reserved for
   * @param meal {} (optional)
   *
   **/
  Shopping.prototype.add = function add(ing, meal) {
    var self = this,
      userid, reservedFor = null,
      $log = self.$log,
      deferred = self.$q.defer(),
      SL = self.getShopping();

    if (meal) {
      reservedFor = meal._id;
    }

    $log.log('Shopping service add', arguments);

    userid = self.getOwner()._id;

    function CBSuccess(ing, meal, item) {
      //item = item.toJSON();
      item.ingredient = ing;
      if (meal) {
        item.reservedFor = meal;
      }
      deferred.resolve(item);
      self.addLocal(item);
    }

    function CBError(ing, meal, err) {
      $log.log(arguments);
      self.toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
    }

    self.$q.when(SL, function(shoppingList){
      shoppingList
        .save({
          ing: ing._id,
          reservedFor: reservedFor
        }, self._.bind(CBSuccess, self, ing, meal), self._.bind(CBError, self, ing, meal));
    });


    return deferred.promise;

  };

  Shopping.prototype.bulkAdd = function bulkAdd(items, meal) {
    var self = this, deferred = self.$q.defer(), items = [];
    self.$.each(items, function (i, item) {
      var added = self.add(item, meal);
      items.push(added);
    });

    self.$q.all(items).then(function(slItems){
      deferred.resolve(slItems);
    });
    return deferred.promise;
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
    var self = this, userid = self.getOwner()._id, params;
    self.$log.log('IN Shopping remove: ', item);

    params = {
      itemid: item._id
    };

    function CBSuccess(item) {
      self.$log.log('removed shopping item, removing locally', item);

      var removedLocally = self.removeLocal(item);
      self.$q.when(removedLocally, function(removedItem){
        deferred.resolve(removedItem);
      });
    }


    if(item.$delete){
      return item.$delete();
    } else {

      var deferred = self.$q.defer();

      self.$resource('/api/users/:userid/shopping/:itemid', params).remove(self._.bind(CBSuccess, self, item));

      return deferred.promise;

    }

  };

  Shopping.prototype.bulkRemove = function bulkRemove(items) {
    var self = this;
    self._.forEach(items, function (item) {
      self.remove(item);
    });

    return items;
  };

  Shopping.prototype.handleMealDelete = function handleMealDelete(meal) {
    var self = this,
      shoppingList = self.getShopping(),
      mealId = meal._id;

    self.$q.when(shoppingList, function (SL) {
      self._.forEach(SL, function (item) {
        if (item.reservedFor._id === mealId) {
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

    self.$q.when(shopping, function (data) {
      self._.forEach(idsArray, function (thisIngID) {
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
    var self = this, shopping;

    shopping = self.getShopping();
    self.$q.when(shopping, function (shoppingList) {
      shoppingList.push(item);
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
    var self = this, shopping;

    shopping = self.getShopping();
    self.$q.when(shopping, function (SL) {
      SL.splice(SL.indexOf(item), 1);
      self.toastr.success(item.ingredient.name + ' has been removed from your shopping');
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
      deferred = self.$q.defer(),
      removed;

    self.$log.log('buying', item);
    removed = self.remove(item);

    // added = self.Cupboard.add(item, true); //true indicates that it was bought not acquired.
    //
    self.$q.when(removed, function (data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  };

  Shopping.prototype.getPurchases = function getPurchases() {
    var self = this,
      user = self.getOwner(),
      deferred = self.$q.defer();

    self.$log.log('shopping init');

    self.$resource('/api/users/:userid/purchases', {
        userid: user._id
      })
      .query(function (purchases) {
        self.$q.when(purchases, function (data) {
          deferred.resolve(data);
        });
      });

    return deferred.promise;
  };

  Shopping.prototype.getBudgetInformation = function getBudgetInformation(date) {

    var self = this,
      deferred, startOfWeek, endOfWeek, remValues = [],
      spentValues = [],
      dayObj = {},
      budget = self.Auth.getUser().budget,
      AmountSpent, data;

    data = self.getPurchases();
    deferred = self.$q.defer();

    self.$q.when(data, function (purchaseData) {
      console.log('purchaseData', purchaseData);
      startOfWeek = self.moment(date).startOf('isoweek');
      endOfWeek = self.moment(date).endOf('isoweek');

      console.log(startOfWeek, endOfWeek);

      for (var i = 0; i < 7; i += 1) {
        dayObj.x = startOfWeek.add(i, 'd');
        remValues.push(dayObj);
        spentValues.push(dayObj);
      }

      for (i = 0; i < 7; i += 1) {
        remValues[i].y = budget - AmountSpent;
        remValues[i].series = 0;
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
