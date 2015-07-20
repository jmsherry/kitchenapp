(function() {
    'use strict';

    angular.module('kitchenapp')
        .service('Cupboard', Cupboard);

    Cupboard.$inject = ['$q', '$resource', 'Auth', 'Ingredients', 'toastr'];

    function Cupboard($q, $resource, Auth, Ingredients, toastr) {

        this.deferred = $q.defer();
        var _cupboard = this.deferred.promise;

        this.getCupboard = function getCupboard () {
          //$q.when(_cupboard, function(){
              return _cupboard;
          //});
        };

        this.setCupboard = function setCupboard (cupboard) {
          //  $q.when(_cupboard, function(){
              _cupboard = cupboard;
            //});
        };

        this.getOwner = function getOwner (){
          return Auth.getUser();
        };

        this.toastr = toastr;
        this.$resource = $resource;
        this.Ingredients = Ingredients;
        this.$q = $q;

        this.init();

    }
    /**
     * init
     *
     * Gets the cupboard from server and saves to local
     *
     */

    Cupboard.prototype.init = function init() {
      console.log('cupboard init')
        var self = this, user = self.getOwner(), cupboard;

        cupboard = self.$resource('/api/users/:userid/cupboard', {userid: user._id})
        .get(function(cupboard){
          console.log(arguments);
          var fullContents = self.populate(cupboard.contents);
          self.deferred.resolve(fullContents);
        });
    };

    Cupboard.prototype.populate = function populate(idsArray){
      var self = this;
      return self.Ingredients.populate(idsArray);
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
    Cupboard.prototype.add = function add (item) {
        var self = this, userid;

        userid = self.getOwner()._id;

        function CBSuccess() {
          self.addLocal(item)
        }

        self.$resource('/api/users/:userid/cupboard', {userid: userid})
        .save({item: item}, _.bind(CBSuccess, self, item));

    };

    Cupboard.prototype.bulkAdd = function bulkAdd(items) {
      var self = this;
      $.each(items, function(i, item){
        self.add(item);
      });
    };

    Cupboard.prototype.update = function update(item) {
      var self = this, userid;

      userid = self.getOwner()._id;

      function CBSuccess() {
        self.updateLocal(item)
      }

      self.$resource('/api/users/:userid/cupboard', {userid: userid}, {update: { method: 'PUT', isArray: true }})
      .update({item: item}, _.bind(CBSuccess, self, item));

    };

    Cupboard.prototype.remove = function remove(item) {
      var self = this, userid;

      userid = self.getOwner()._id;

      function CBSuccess() {
        self.removeLocal(item)
      }

      function CBError() {
        self.toastr.error('could not add '+ item.name + ' to cupboard');
      }

      self.$resource('/api/users/:userid/cupboard', {userid: userid})
      .remove({item: item}, _.bind(CBSuccess, self, item), _.bind(CBError, self, item));

    };

    Cupboard.prototype.bulkRemove = function bulkRemove (items) {
      var self = this;
      _.forEach(items, function(item){
        self.remove(item);
      });

      return items;
    };


    Cupboard.prototype.process = function process (idsArray) {
        var self = this,
            presentIngredients = [],
            missingIngredients = [],
            cupboard = self.getCupboard();

        _.forEach(idsArray, function(thisIngID) {
            if (cupboard.contents.indexOf(thisIngID) === -1) {
                missingIngredients.push(thisIngID);
            } else {
                presentIngredients.push(thisIngID);
            }
        });


        return {
          present: presentIngredients,
          missing: missingIngredients
        };

    };

    Cupboard.prototype.addLocal = function addLocal(item){
      var self = this, cupboard;

      cupboard = self.getCupboard();
      this.$q.when(cupboard, function (data) {
        var newCupboard = data.push(item);
        self.setCupboard(newCupboard);
        self.toastr.success(item.name + ' has been added to your cupboard');
      });
    };

    Cupboard.prototype.updateLocal = function updateLocal(item){
      var self = this, cupboard, oldItem;

      cupboard = self.getCupboard();
      this.$q.when(cupboard, function (data) {
        oldItem = _.find(cupboard, {_id: item._id});
        oldItem = item;

        self.setCupboard(cupboard);
        self.toastr.success(item.name + ' has been updated in your cupboard');
      });
    };

    Cupboard.prototype.removeLocal = function removeLocal(item){
      var self = this, cupboard;

      cupboard = self.getCupboard();
      this.$q.when(cupboard, function (data) {
        cupboard.splice(cupboard.contents.indexOf(item), 1);
        self.toastr.success(item.name + ' has been removed from your cupboard');
      });
    };

}());
