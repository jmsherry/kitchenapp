(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .service('Cupboard', Cupboard);

  Cupboard.$inject = ['$q', '$resource', '$log', 'Auth', 'Ingredients', 'toastr', '$', '_', 'moment'];

  function Cupboard($q, $resource, $log, Auth, Ingredients, toastr, $, _, moment) {

    this.deferred = $q.defer();
    var _cupboard = this.deferred.promise;

    this.getCupboard = function getCupboard() {
      return _cupboard;
    };

    this.setCupboard = function setCupboard(cupboard) {
      _cupboard = cupboard;
    };

    this.getOwner = function getOwner() {
      return Auth.getUser();
    };

    this.toastr = toastr;
    this.$resource = $resource;
    this.Ingredients = Ingredients;
    this.$q = $q;
    this.$log = $log;
    this._ = _;
    this.$ = $;
    this.moment = moment;

    this.init();

  }
  /**
   * init
   *
   * Gets the cupboard from server and saves to local
   *
   */

  Cupboard.prototype.init = function init() {

    var self = this,
      owner = self.getOwner(),
      cupboard;

    self.$log.log('cupboard init');

    function successCB(cupboard) {
      self.$q.when(cupboard, function (data) {
        self.$log.log('cupboard init SL returned: ', data);
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
      self.server = self.$resource('/api/users/:userid/cupboard/:itemid', {
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

  Cupboard.prototype.populate = function populate(items, meal) {
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
      thisIng = self.Ingredients.getIngredientById(thisIng); //returns a promise
      promises.push(thisIng);
    }

    self.$q.all(promises).then(function (data) {
      var i, len = data.length;
      for (i = 0; i < len; i += 1) {
        items[i].ingredient = data[i];
        if (meal) {
          items[i].reservedFor = meal;
        }
      }
      deferred.resolve(items);
    });

    return deferred.promise;
  };

  /**
   * get
   *
   * Returns a local version of the Cupboard
   *
   */
  Cupboard.prototype.get = function get() {
    var self = this;
    return self.getCupboard();
  };

  /**
   * add
   *
   * @param ingredient {}
   * Adds an ingredient to the ingredients array
   *
   */
  Cupboard.prototype.add = function add(item, bought) {
    var self = this,
      user, userid, ingId, deferred = self.$q.defer(),
      reservedForId = null,
      cupboard = self.getCupboard();

    if (!item) {
      throw new Error('No item passed to cupboard add');
    } else if (item.ingredient && !item.ingredient._id) {
      throw new Error('Unpopulated ingredient being added');
    }

    self.$log.log('CUPBOARD ADD ITEM', item);
    user = self.getOwner();
    userid = user._id;

    // Add wrapper if ingredient passed, rather than shopping item
    if (!item.ingredient && item.name) {
      item = {
        ingredient: item
      };
    }

    ingId = item.ingredient._id;

    if (!item.owner) {
      item.owner = userid;
    }

    if (item.reservedFor) {
      reservedForId = item.reservedFor._id;
    }

    item.bought = bought;

    function CBSuccess(item, response) {
      self.$log.log('in Cupboard Add CBSuccess: ', arguments);
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

    function CBError(item, err) {
      self.$log.error('In cupboard add CBError', err, item);
      self.toastr.error('Failed to add ' + item.name + "!", 'Server Error ' + err);
    }

    self.server.save({
      ingId: ingId,
      reservedForId: reservedForId,
      bought: bought
    }, self._.bind(CBSuccess, self, item), self._.bind(CBError, self, item));

    return deferred.promise;

  };

  Cupboard.prototype.bulkAdd = function bulkAdd(ings, bought) {
    var self = this,
      deferred = self.$q.defer(),
      items = [];
    self.$.each(ings, function (i, ing) {
      self.$log.log('adding', ing);
      self.add(ing, bought);
    });

    self.$q.all(items).then(function (itemsArr) {
      deferred.resolve(itemsArr);
    });

    return deferred.promise;
  };

  Cupboard.prototype.update = function update(item) {
    var self = this,
      depop;

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

  Cupboard.prototype.remove = function remove(item) {
    var self = this,
      deferred = self.$q.defer(),
      depop;

    //depopulate
    depop = self.depopulate(item);

    function CBSuccess(item, response) {
      self.$log.log('removed cupboard item, removing locally', item);
      var removed = self.removeLocal(item);
      self.$q.when(removed, function (removedItem) {
        deferred.resolve(removedItem);
      });
    }

    function CBError(item, err) {
      self.toastr.error('could not remove ' + item.name + ' from cupboard');
      deferred.reject(err)
    }

    depop.$delete(self._.bind(CBSuccess, self, item), self._.bind(CBError, self, item));

    return deferred.promise;

  };

  Cupboard.prototype.bulkRemove = function bulkRemove(items) {
    var self = this,
      removedItemPromises = [],
      deferred = self.$q.defer();

    self._.forEach(items, function (item) {
      var itemPromise = self.remove(item);
      removedItemPromises.push(itemPromise);
    });

    self.$q.all(removedItemPromises).then(function (removedItems) {
      deferred.resolve(removedItems);
    });

    return deferred.promise;
  };

  Cupboard.prototype.handleMealDelete = function handleMealDelete(meal) {
    var self = this,
      cupboard = self.getCupboard(),
      mealId = meal._id;

    self.$q.when(cupboard, function (data) {
      self._.forEach(data, function (item) {
        if (item.reservedFor === mealId) {
          item.reservedFor = null;
          self.update(item);
        }
      });
    });

    return meal;
  };

  Cupboard.prototype.reserve = function reserve(item, meal, overwrite) {
    var self = this,
      deferred = self.$q.defer();

    // Prevent accidental overwrite
    if (typeof item.reservedFor === 'string' && !overwrite) {
      throw new Error('Item already reserved');
    }

    if (meal._id) {
      item.reservedFor = meal;
    }

    function CBSuccess(item, resp) {
      self.$q.when(resp, function () {
        self.$log.log('reserved cupboard item', resp);
        var reservedLocally = self.reserveLocal(item, meal);
        self.$q.when(reservedLocally, function (locallyReservedItem) {
          deferred.resolve(locallyReservedItem);
        });
      });
    }

    function CBError(item, err) {
      self.$log.log(arguments, err);
      self.toastr.error('Could not reserve ' + item.name + ' from cupboard');
      deferred.reject(err);
    }

    self.server
      .update({
        item: item
      }, self._.bind(CBSuccess, self, item), self._.bind(CBError, self, item));

    return deferred.promise;
  };

  Cupboard.prototype.bulkReserve = function bulkReserve(items, meal, overwrite) {
    var self = this,
      deferred = self.$q.defer(),
      promises = [];

    self._.forEach(items, function (item) {
      var reservedItem;
      reservedItem = self.reserve(item, meal);
      promises.push(reservedItem)
    });

    self.$q.all(promises).then(function (reservedItems) {
      deferred.resolve(reservedItems);
    });

    return deferred.promise;
  };

  //Assess a meal vs what is in the cupboard currently
  Cupboard.prototype.process = function process(ings) {
    var self = this,
      deferred = self.$q.defer(),
      presentIngredientItems = [],
      missingIngredients = [],
      cupboard = self.getCupboard();

    self.$q.when(cupboard, function (data) {
      self._.forEach(ings, function (thisIng) {
        var item, len = data.length,
          i, thisItem, thisItemIng;

        for (i = 0; i < len; i += 1) {
          thisItem = data[i];
          thisItemIng = thisItem.ingredient;
          if (thisItemIng._id === thisIng._id) {
            item = thisItem;
            break;
          }
        }

        if (item) {
          presentIngredientItems.push(item._id);
        } else {
          missingIngredients.push(thisIng._id);
        }

      });

      deferred.resolve({
        present: presentIngredientItems,
        missing: missingIngredients
      });

    });
    return deferred.promise;
  };

  Cupboard.prototype.addLocal = function addLocal(item) {
    var self = this,
      cupboard, deferred = self.$q.defer();

    cupboard = self.getCupboard();
    self.$q.when(cupboard, function (cupb) {
      cupb.push(item);
      self.toastr.success(item.ingredient.name + ' has been added to your cupboard');
      deferred.resolve(item);
    });

    return deferred.promise;

  };

  Cupboard.prototype.updateLocal = function updateLocal(item) {
    var self = this,
      cupboard, oldItem;

    cupboard = self.getCupboard();
    self.$q.when(cupboard, function (data) {
      oldItem = self._.find(data, {
        _id: item._id
      });
      oldItem = item;

      self.toastr.success(item.ingredient.name + ' has been updated in your cupboard');
    });
  };

  Cupboard.prototype.reserveLocal = function reserveLocal(item, meal) {
    var self = this,
      cupboard, oldItem, deferred = self.$q.defer();

    cupboard = self.getCupboard();
    self.$q.when(cupboard, function (data) {
      oldItem = self._.find(data, {
        _id: item._id
      });
      oldItem = item;
      deferred.resolve(oldItem);
      self.toastr.success(item.ingredient.name + ' has been reserved for ' + meal.name + '.');
    });

    return deferred.promise
  };

  Cupboard.prototype.removeLocal = function removeLocal(item) {
    var self = this,
      cupboard, deferred = self.$q.defer();

    cupboard = self.getCupboard();
    self.$q.when(cupboard, function (items) {
      var removedItem = items.splice(items.indexOf(item), 1);
      deferred.resolve(removedItem);
      self.toastr.success(item.ingredient.name + ' has been removed from your cupboard');
    });

    return deferred.promise;

  };

  Cupboard.prototype.depopulate = function depopulate(item) {
    var self = this;
    if (!item) {
      self.toastr.error('Error depolulating: No item sent');
      throw new Error('Error in Cupboard.depopulation');
    } else if (item.$promise || item.$resolved) {
      throw new Error('Promise sent to Cupboard.depopulation');
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

}());
