(function() {
    'use strict';

    angular.module('kitchenapp')
        .service('Cupboard', Cupboard);

    Cupboard.$inject = ['$q', '$resource', 'Auth', 'Ingredients', 'toastr'];

    function Cupboard($q, $resource, Auth, Ingredients, toastr) {

        var _cupboard = [];

        this.getCupboard = function getCupboard () {
            return _cupboard;
        };

        this.setCupboard = function setCupboard (cupboard) {
            _cupboard = cupboard;
        };

        // this.getResource = function getResource () {
        //     return _resource;
        // };

        this.getOwner = function getOwner (){
          return Auth.getUser();
        };

        this.toastr = toastr;
        this.$resource = $resource;

        this.init();

    }


    Cupboard.prototype.init = function init() {
      console.log('cupboard init')
        var self = this, user = self.getOwner(), cupboard;

        cupboard = self.$resource('/api/cupboard/:id', {id: user._id})
        .get(function(){
          self.setCupboard(cupboard);
        });
    };

    Cupboard.prototype.populate = function populate(idsArray){
      return Ingredients.populate(idsArray);
    };

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
    Cupboard.prototype.add = function add (ing) {
        var self = this, userid;

        userid = self.getOwner()._id;

        function CBSuccess () {
          var originalCupboard = self.getCupboard(),
          newCupboard = originalCupboard.push(ing)
            self.setCupboard(newCupboard);
            self.toastr.success(ing.name + ' has been added to your cupboard');
        }

        self.$resource('/api/cupboard/').save({itemid: ing._id, userid: userid}, _.bind(CBSuccess, self, ing));

    };

    Cupboard.prototype.bulkAdd = function bulkAdd(newIngs) {
      var self = this;
      $.each(newIngs, function(i, ing){
        self.add(ing);
      });
    };

    Cupboard.prototype.remove = function remove (ing) {
      var self = this;
        function CBSuccess () {
            var cupboard = self.getCupboard();

            cupboard.splice(cupboard.indexOf(ing), 1);
            self.toastr.success(ing.name + ' has been removed from your cupboard');
        }

        self.$resource('/api/cupboard/').remove(ing, _.bind(CBSuccess, self, ing));
    };

    Cupboard.prototype.bulkRemove = function remove (ings) {
      //remove all present ingredients from the users cupboard
      _.forEach(ings, function(ing){
        this.remove(ing);
      });

      return ings;
    };


    Cupboard.prototype.process = function process (idsArray) {
        var self = this,
            presentIngredients = [],
            missingIngredients = [],
            cupboard = self.getCupboard();

        _.forEach(idsArray, function(thisIngID) {
            if (cupboard.indexOf(thisIngID) === -1) {
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

    Cupboard.prototype.save = function save(){
      var self, resource, cupboard;
      cupboard = self.getCupboard();
      self.$resource('/api/cupboard').save(cupboard, function(err, cup){
        if(err){
          toastr.error(err)
        }
        toastr.success('Cupboard Updated');
        console.log(cup);
        return cup;
      })
    };

}());
