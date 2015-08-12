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
        this.initialised = false;

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
          self.$log.log('cupboard serv init:', arguments);
          var contents = self.populate(cupboard.contents);
          self.$q.when(contents, function(data){
            cupboard.contents = data;
            self.$log.log('cupboard contents resolve:', data);
            self.deferred.resolve(cupboard);
            self.initialised = true;
          });
        });
    };

    Cupboard.prototype.populate = function populate(items){
      var self = this, i, len = items.length, deferred = self.$q.defer(), promises = [], thisIng;

      for (i = 0; i < len; i+=1) {
        thisIng = items[i].ingredient;
        thisIng = self.Ingredients.getById(thisIng); //returns a promise
        promises.push(thisIng);
      }

      self.$q.all(promises).then(function(data){
        var i, len = data.length;
        for(i=0; i<len; i+=1){
          items[i].ingredient = data[i];
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
      var self = this, userid, itemid;

      userid = self.getOwner()._id;
      itemid = item._id;

      function CBSuccess(item, resp) {
        self.updateLocal(item);
      }

      function CBError(ing, err) {
        self.$log.log(arguments);
          self.toastr.error('Failed to add ' + err.config.data.name + "!", 'Server Error ' + err.status + ' ' + err.data.message);
      }

      self.$resource('/api/users/:userid/cupboard/itemid', {userid: userid, itemid: itemid}, {update: { method: 'PUT', isArray: false }})
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

    Cupboard.prototype.handleMealDelete = function handleMealDelete (meal) {
      var self = this, idsArray = [], cupboard = self.getCupboard(), mealId = meal._id;

      self.$q.when(cupboard, function(data){
        _.forEach(data.contents, function(item){
          if(item.reservedFor === mealId){
            item.reservedFor = null;
            self.update(item);
          }
        });
      });


      return meal;
    };

    Cupboard.prototype.reserve = function reserve(item, mealId) {
      var self = this, userid;

      userid = self.getOwner()._id;

      function CBSuccess(item, resp) {
          self.$log.log('reserved cupboard item', arguments);
          self.reserveLocal(item);
      }

      function CBError(item, resp) {
        self.$log.log(arguments);
        self.toastr.error('Could not reserve '+ item.name + ' from cupboard');
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
      .update({item: item}, _.bind(CBSuccess, self, item), _.bind(CBError, self, item));

    };

    Cupboard.prototype.bulkReserve = function bulkRemove (items, mealId) {
      var self = this;
      _.forEach(items, function(item){
        self.reserve(item, mealId);
      });

      return items;
    };

    //Assess a meal vs what is in the cupboard currently
    Cupboard.prototype.process = function process(ings, meal) {
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
                  //item.reservedFor = meal._id;
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
        var ing;

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
          ing = self.Ingredients.getById(ing);


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
