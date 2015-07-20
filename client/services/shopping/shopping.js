(function () {
    'use strict';

    angular.module('kitchenapp')
        .service('Shopping', Shopping);

    Shopping.$inject = ['$q', '$resource', 'Auth', 'Ingredients', 'toastr', 'Cupboard'];

    function Shopping($q, $resource, Auth, Ingredients, toastr, Cupboard) {

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
        this.Cupboard = Cupboard;

        this.init();

    }

    /**
     * init
     *
     * Gets the shopping from server and saves to local
     *
     **/

    Shopping.prototype.init = function init() {
        console.log('shopping init')
        var self = this,
            user = self.getOwner(),
            shopping;

        shopping = self.$resource('/api/users/:userid/shopping', {
                userid: user._id
            })
            .get(function (shopping) {
                console.log(arguments);
                var fullContents = self.populate(shopping.contents);
                self.deferred.resolve(fullContents);
            });
    };

    Shopping.prototype.populate = function populate(idsArray) {
        var self = this;
        return self.Ingredients.populate(idsArray);
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
    Shopping.prototype.add = function add(item) {
        var self = this,
            userid;

        userid = self.getOwner()._id;

        function CBSuccess() {
            self.addLocal(item);
        }

        self.$resource('/api/users/:userid/shopping', {
                userid: userid
            })
            .save({
                item: item
            }, _.bind(CBSuccess, self, item));

    };

    Shopping.prototype.bulkAdd = function bulkAdd(items) {
      var self = this;
      $.each(items, function(i, item){
        self.add(item);
      });
    };

    /**
     * update
     *
     * @param ingredient item {}
     * Updates an ingredient in the ingredients user's array
     *
     */

    Shopping.prototype.update = function update(item) {
        var self = this,
            userid;

        userid = self.getOwner()._id;

        function CBSuccess() {
            self.updateLocal(item);
        }

        self.$resource('/api/users/:userid/shopping', {
                userid: userid
            }, {
                update: {
                    method: 'PUT',
                    isArray: true
                }
            })
            .update({
                item: item
            }, _.bind(CBSuccess, self, item));

    };

    /**
     * remove
     *
     * @param ingredient {}
     * Removes an ingredient from the ingredients array
     *
     */

    Shopping.prototype.remove = function remove(item) {
        console.log('IN Shopping remove: ', item);
        var self = this,
            userid;

        userid = self.getOwner()._id;

        function CBSuccess() {
            console.log('removed shopping item, removing locally', item);
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

        _.forEach(idsArray, function (thisIngID) {
            if (shopping.contents.indexOf(thisIngID) === -1) {
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

    Shopping.prototype.addLocal = function addLocal(item) {
        var self = this,
            shopping;

        shopping = self.getShopping();

        this.$q.when(shopping, function (data) {
            data.push(item);
            self.setShopping(data);
            self.toastr.success(item[0].name + ' has been added to your shopping');
        });

    };

    Shopping.prototype.updateLocal = function updateLocal(item) {
        var self = this,
            shopping, oldItem;

        shopping = self.getShopping();

        this.$q.when(shopping, function (data) {
            oldItem = _.find(data, {
                _id: item._id
            });
            oldItem = item;

            self.setShopping(data);
            self.toastr.success(item[0].name + ' has been added to your shopping');
        });
    };

    Shopping.prototype.removeLocal = function removeLocal(item) {
        var self = this,
            shopping;

        shopping = self.getShopping();

        this.$q.when(shopping, function (data) {
            data.splice(data.indexOf(item), 1);
            self.toastr.success(item.name + ' has been removed from your shopping');
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
            user = Auth.getUser(); //add budgeting logic next

        self.Shopping.add(item);
    };

}());
