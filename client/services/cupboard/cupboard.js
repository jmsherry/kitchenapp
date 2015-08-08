(function() {
    'use strict';

    angular.module('kitchenapp')
        .service('Cupboard', Cupboard);

    Cupboard.$inject = ['$q', '$resource', '$log', 'Auth', 'Ingredients', 'toastr'];

    function Cupboard($q, $resource, $log, Auth, Ingredients, toastr) {

        this.deferred = $q.defer();
        var _cupboard = this.deferred.promise;

        this.getCupboard = function getCupboard () {
              return _cupboard;
        };

        this.setCupboard = function setCupboard (cupboard) {
              _cupboard = cupboard;
        };

        this.getOwner = function getOwner (){
          return Auth.getUser();
        };

        this.toastr = toastr;
        this.$resource = $resource;
        this.Ingredients = Ingredients;
        this.$q = $q;
        this.$log = $log;

        this.init();

    }
    /**
     * init
     *
     * Gets the cupboard from server and saves to local
     *
     */

    Cupboard.prototype.init = function init() {

        var self = this, user = self.getOwner(), cupboard;
        self.$log.log('cupboard init');
        cupboard = self.$resource('/api/users/:userid/cupboard', {userid: user._id})
        .get(function(cupboard){
          self.$log.log(arguments);
          var contents = self.populate(cupboard.contents);
          cupboard.contents = contents;
          self.deferred.resolve(cupboard);
        });
    };

    Cupboard.prototype.populate = function populate(items){
      var self = this, i, len = items.length;
      for (i = 0; i < len; i+=1) {
        items[i].ingredient = self.Ingredients.getById(items[i].ingredient);
      }
      return items;
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
    Cupboard.prototype.add = function add(item) {

        var self = this, userid, ingId, $deferred = self.$q.defer();
self.$log.log('CUPBOARD ADD ITEM', item);
        userid = self.getOwner()._id;

        //handle unpopulated items
        if(!item.ingredient._id){
          ingId = item.ingredient;
        } else {
          ingId = item.ingredient._id;
        }

        function CBSuccess(item, response) {
          self.$log.log('in Cupboard Add CBSuccess: ', arguments);
          var addedLocally;
          response.ingredient = item.ingredient;
          addedLocally = self.addLocal(response);
          $deferred.resolve(addedLocally);
        }

        function CBError(ing, err) {
          self.$log.log(arguments);
            self.toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
        }

        self.$resource('/api/users/:userid/cupboard', {userid: userid})
        .save({
          ingId: ingId,
          reservedFor: item.reservedFor
        }, _.bind(CBSuccess, self, item), _.bind(CBError, self, item));

        return $deferred.promise;

    };

    Cupboard.prototype.bulkAdd = function bulkAdd(ings) {
      var self = this;
      $.each(ings, function(i, ing){
        self.add(ing);
      });
    };

    Cupboard.prototype.update = function update(item) {
      var self = this, userid;

      userid = self.getOwner()._id;

      function CBSuccess(item, resp) {
        self.updateLocal(item);
      }

      function CBError(ing, err) {
        self.$log.log(arguments);
          self.toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
      }

      self.$resource('/api/users/:userid/cupboard', {userid: userid}, {update: { method: 'PUT', isArray: false }})
      .update({item: item}, _.bind(CBSuccess, self, item), _.bind(CBError, self, item));

    };

    Cupboard.prototype.remove = function remove(item) {
      var self = this, userid;

      userid = self.getOwner()._id;

      function CBSuccess(item) {
          self.$log.log('removed cupboard item, removing locally', item);
          self.removeLocal(item);
      }

      function CBError(item) {
        self.toastr.error('could not remove '+ item.name + ' from cupboard');
      }

      self.$resource('/api/users/:userid/cupboard/:itemid', {
          userid: userid,
          itemid: item._id
      })
      .remove(_.bind(CBSuccess, self, item), _.bind(CBError, self, item));

    };

    Cupboard.prototype.bulkRemove = function bulkRemove (items) {
      var self = this;
      _.forEach(items, function(item){
        self.remove(item);
      });

      return items;
    };

    Cupboard.prototype.reserve = function reserve(item, mealId) {
      var self = this, userid;

      // item.reservedFor = mealId;
      // item.dateAdded = new Date();

      userid = self.getOwner()._id;

      function CBSuccess(item, resp) {
          self.$log.log('reserved cupboard item', arguments);
          self.reserveLocal(item);
      }

      function CBError(item, resp) {
        self.$log.log(arguments);
        self.toastr.error('could not reserve '+ item.name + ' from cupboard');
      }

      self.$resource('/api/users/:userid/cupboard/:itemid', {
          userid: userid,
          itemid: item._id
      }, {
        'update': {
          method: 'PUT',
          isArray: false
        }
      })
      .update(item, _.bind(CBSuccess, self, item), _.bind(CBError, self, item));

    };

    Cupboard.prototype.bulkReserve = function bulkRemove (items, mealId) {
      var self = this;
      _.forEach(items, function(item){
        self.reserve(item, mealId);
      });

      return items;
    };


    Cupboard.prototype.process = function process(ings) {
        var self = this,
        deferred = self.$q.defer(),
            presentIngredientItems = [],
            missingIngredients = [],
            cupboard = self.getCupboard();

        self.$q.when(cupboard, function(data){
          _.forEach(ings, function(thisIng) {
              var item, len = data.contents.length, i, thisItem, thisItemIng;

              for(i=0; i < len; i+=1){
                thisItem = data.contents[i];
                thisItemIng = thisItem.ingredient;
                if(thisItemIng._id === thisIng._id){
                  item = thisItem;
                  break;
                }
              }

              if (item) {
                  presentIngredientItems.push(item);
              } else {
                  missingIngredients.push(thisIng);
              }

          });

          deferred.resolve({
            present: presentIngredientItems,
            missing: missingIngredients
          });

        });
        return deferred.promise;
    };

    Cupboard.prototype.addLocal = function addLocal(item){
      var self = this, cupboard;

      cupboard = self.getCupboard();
      self.$q.when(cupboard, function(data) {

        function add(item) {
          var items = data.contents, ing;
          items.push(item);
          self.toastr.success(item.ingredient.name + ' has been added to your cupboard');
          return item;
        }

        if(item.ingredient.name){
          add(item);
        } else {
          //Deal with unpopulated
          ing = item.ingredient;
          ing = Ingredients.getById(ing);
          self.$q.when(ing, function(ingData){
            ing = ingData;
            add(item);
          });
        }

      });
    };

    Cupboard.prototype.updateLocal = function updateLocal(item){
      var self = this, cupboard, oldItem;

      cupboard = self.getCupboard();
      self.$q.when(cupboard, function (data) {
        oldItem = _.find(data, {_id: item._id});
        oldItem = item;

        self.toastr.success(item.ingredient.name + ' has been updated in your cupboard');
      });
    };

    Cupboard.prototype.reserveLocal = function reserveLocal(item){
      var self = this, cupboard, oldItem;

      cupboard = self.getCupboard();
      self.$q.when(cupboard, function (data) {
        oldItem = _.find(data, {_id: item._id});
        oldItem = item;

        self.toastr.success(item.ingredient.name + ' has been reserved for ' + item.reservedFor.name + ' on ' + moment(item.reservedFor.date, "DD MM YY"));
      });
    };

    Cupboard.prototype.removeLocal = function removeLocal(item){
      var self = this, cupboard;

      cupboard = self.getCupboard();
      self.$q.when(cupboard, function (data) {
	      var items = data.contents;

        //adjust for wrappers - Maybe convert to shopping list items
        if(item.ingredient && item.ingredient.name){
          name = item.ingredient.name;
        } else {
          name = item.name;
        }

        items.splice(items.indexOf(item), 1);
        self.toastr.success(name + ' has been removed from your cupboard');
      });
    };

}());
