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
        self.$q.when(populated, function (fullData) {
          self.deferred.resolve(fullData);
        });
      });
    }

    function errorCB(err) {
      self.toastr.error(err.message);
      self.deferred.reject(err);
    }

    self.$q.when(owner, function (ownerData) {

      //set resource
      self.server = self.$resource('/api/users/:userid/shopping/:itemid', {
        userid: ownerData._id,
        itemid: '@_id'
      }, {
        update: {
          method: 'PUT',
          isArray: false
        }
      });

      //set local
      self.server.query(self._.bind(successCB, self), self._.bind(errorCB, self));

    });

  };

  Shopping.prototype.populate = function populate(items) {
    var self = this,
      i, len = items.length,
      deferred = self.$q.defer(),
      promises = [],
      thisIng;

    if (self._.isPlainObject(items)) {
      items = [items];
    } else if (!self._.isArray(items)) {
      throw new Error('Wrong type of argument passed to Shopping.populate');
    }

    for (i = 0; i < len; i += 1) {
      thisIng = items[i].ingredient;
      thisIng = self.Ingredients.getIngredientById(items[i].ingredient);
      promises.push(thisIng);
    }

    self.$q.all(promises).then(function (popdItems) {
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
      SL = self.getShopping(),
      item = {};

    item.ingredient = ing;

    if (meal) {
      item.reservedFor = meal._id;
    }

    $log.log('Shopping service add', arguments);

    function CBSuccess(ing, meal, response) {
      self.$log.log('in Shopping Add CBSuccess: ', arguments);
      self.$q.when(response, function (data) {
        var addedLocally;

        data.ingredient = item.ingredient; //fast populate
        addedLocally = self.addLocal(data);
        self.$log.log('returned promise from localAdd', addedLocally);
        self.$q.when(addedLocally, function (storedItem) {
          deferred.resolve(storedItem);
        });
      });
    }

    function CBError(ing, meal, err) {
      $log.error('In Shopping service add CBError', err, ing, meal);
      self.toastr.error('Failed to add ' + ing.name + "!", 'Server Error ' + err);
    }

    self.server
      .save(item, self._.bind(CBSuccess, self, ing, meal), self._.bind(CBError, self, ing, meal));

    return deferred.promise;

  };

  Shopping.prototype.bulkAdd = function bulkAdd(items, meal) {
    var self = this,
      deferred = self.$q.defer(),
      itemPromises = [];
    self.$.each(items, function (i, item) {
      var added = self.add(item, meal);
      itemPromises.push(added);
    });

    self.$q.all(itemPromises).then(function (slItems) {
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

  Shopping.prototype.update = function update(item) {
    var self = this, depop;

    //depopulate
    depop = self.depopulate(item);

    function CBSuccess(item, resp) {
      self.$log.log(arguments);
      self.updateLocal(item);
    }

    function CBError(item, err) {
      self.$log.error('Cupboard update error', item, error);
      self.toastr.error('Failed to add ' + item.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
    }

    depop.$update(self._.bind(CBSuccess, self, item), self._.bind(CBError, self, item));
  };

  /**
   * remove
   *
   * @param ingredient {}
   * Removes an ingredient from the ingredients array
   *
   */

  Shopping.prototype.remove = function remove(item) {
    var self = this,  deferred = self.$q.defer(), depop;

    //depopulate
    depop = self.depopulate(item);

    function CBSuccess(item, response) {
      self.$log.log('removed shopping item, removing locally', item);
      var removed = self.removeLocal(item);
      self.$q.when(removed, function (removedItem) {
        deferred.resolve(removedItem);
      });
    }

    function CBError(item, err) {
      self.toastr.error('could not remove ' + item.name + ' from shopping list.');
      deferred.reject(err)
    }

    depop.$delete(self._.bind(CBSuccess, self, item), self._.bind(CBError, self, item));

    return deferred.promise;

  };

  Shopping.prototype.bulkRemove = function bulkRemove(items) {
    var self = this, removedItemPromises = [], deferred = self.$q.defer();

    self._.forEach(items, function (item) {
      var itemPromise = self.remove(item);
      removedItemPromises.push(itemPromise);
    });

    self.$q.all(removedItemPromises).then(function(removedItems){
      deferred.resolve(removedItems);
    });

    return deferred.promise;
  };

  Shopping.prototype.handleMealDelete = function handleMealDelete(meal) {
    var self = this, deferred = self.$q.defer()
      shoppingList = self.getShopping(),
      mealId = meal._id;


    self.$q.when(shoppingList, function (SL) {
    var itemsToBeRemoved, removedItems;
      itemsToBeRemoved = SL.filter({reservedFor: meal._id});
      removedItems = self.bulkRemove(itemsToBeRemoved);
      deferred.resolve({removedItems: removedItems, meal: meal});
    });

    return deferred.promise;
  };

  Shopping.prototype.addLocal = function addLocal(item) {
    var self = this,
      shopping, deferred = self.$q.defer();

    shopping = self.getShopping();
    self.$q.when(shopping, function (shoppingList) {
      shoppingList.push(item);
      self.toastr.success(item.ingredient.name + ' has been added to your shopping');
      deferred.resolve(item);
    });

    return deferred.promise;

  };

  Shopping.prototype.updateLocal = function updateLocal(item) {
    var self = this,
      shopping, oldItem;

    shopping = self.getShopping();
    self.$q.when(shopping, function (data) {
      oldItem = self._.find(data, {
        _id: item._id
      });
      oldItem = item;

      self.toastr.success(item.ingredient.name + ' has been updated in your shopping');
    });
  };

  Shopping.prototype.removeLocal = function removeLocal(item) {
    var self = this,
      shopping, deferred = self.$q.defer();

    shopping = self.getShopping();
    self.$q.when(shopping, function (items) {
      var removedItem = items.splice(items.indexOf(item), 1);
      deferred.resolve(removedItem);
      self.toastr.success(item.ingredient.name + ' has been removed from your shopping');
    });

    return deferred.promise;

  };

  Shopping.prototype.depopulate = function depopulate(item) {
    var self = this;
    if (!item) {
      self.toastr.error('Error depolulating: No item present');
      throw new Error('Error in Shopping.depopulation');
    } else if (item.$promise || item.$resolved) {
      throw new Error('Promise sent to Shopping.depopulation');
    }

    item = angular.copy(item); //cloned so as not to depop the actual object

    // depopulate owner, ingredient, reservedFor fields
    if (item.owner && typeof item.owner === 'object' && item.owner._id) {
      item.owner = item.owner._id;
    }
    if (item.ingredient && typeof item.ingredient === 'object' && item.ingredient._id) {
      item.ingredient = item.ingredient._id;
    }
    if (item.reservedFor && typeof item.reservedFor === 'object' && item.reservedFor._id) {
      item.reservedFor = item.reservedFor._id;
    }

    //For safety remove any promise cruft
    delete(item.$promise);
    delete(item.$resolved);

    return item;

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
