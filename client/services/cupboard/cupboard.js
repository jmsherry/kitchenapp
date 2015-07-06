(function() {
    'use strict';

    angular.module('kitchenapp')
        .service('Cupboard', Cupboard);

    Cupboard.$inject = ['$q', '$resource', 'Auth', 'Ingredients', 'toastr'];

    function Cupboard($q, $resource, Auth, Ingredients, toastr) {

        var _cupboard = [],
        _resource = $resource('/api/cupboard');

        this.getCupboard = function getCupboard () {
            return _cupboard;
        };

        this.setCupboard = function setCupboard (cupboard) {
            _cupboard = cupboard;
        };

        this.getResource = function getResource () {
            return _resource;
        };

        this.getOwner = function getOwner (){
          return Auth.getUser();
        };

        this.toastr = toastr;

    }


    Cupboard.prototype.init = function init() {
      console.log('cupboard init')
        var user = this.getOwner();
        this.setCupboard(user.cupboard);
    };

    Cupboard.prototype.get = function get() {
        return this.getCupboard();
    };


    /**
     * add
     *
     * @param ingredient {}
     * Adds an ingredient to the ingredients array
     *
     */
    Cupboard.prototype.add = function add (ing) {

        function CBSuccess () {
            this.setCupboard(this.getCupboard().push(ing));
            this.toastr.success(ing.name + ' has been added to your cupboard');
        }

        this.getResource().save(ing, _.bind(CBSuccess, this, ing));

    };

    Cupboard.prototype.bulkAdd = function bulkAdd(newIngs) {
      var self = this;
      $.each(newIngs, function(i, ing){
        self.add(ing);
      });
    };

    Cupboard.prototype.remove = function remove (ing) {
        function CBSuccess () {
            var cupboard = this.getCupboard();

            cupboard.splice(cupboard.indexOf(ing), 1);
            this.toastr.success(ing.name + ' has been removed from your cupboard');
        }

        this.getResource().remove(ing, _.bind(CBSuccess, this, ing));
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
            cupboard = this.getCupboard();

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
      var resource, cupboard;
      resource = this.getResource();
      cupboard = this.getCupboard();
      resource.save(cupboard, function(err, cup){
        if(err){
          toastr.error(err)
        }
        toastr.success('Cupboard Updated');
        console.log(cup);
        return cup;
      })
    }

}());
