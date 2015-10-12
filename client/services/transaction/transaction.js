(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .factory('Transaction', Transaction);

  Transaction.$inject = ['$q', '$resource', 'Auth', 'Ingredients', 'toastr', 'Cupboard', '$log', 'moment', '_'];

  function Transaction($q, $resource, Auth, Ingredients, toastr, Cupboard, $log, moment, _) {

    var _purchases = $q.defer();

    function getPurchases() {
      var $user = Auth.getUser();

      $q.when($user, function (user) {
        $resource('/api/users/:userid/purchases', {
            userid: user._id
          })
          .query(function ($data) {
            $q.when($data, function (data) {
              $log.log(data);
              _purchases.resolve(data);
            });
          });
      });

      return _purchases.promise;
    }

    function getBudgetInformation(date) {

      var deferred, startOfWeek, endOfWeek, remValues = [],
        spentValues = [],
        $user = Auth.getUser(),
        budget,
        $data, weeksPurchases = [],
        pdLen, wpCondensed = [],
        thisPurchase, amountSpent = 0,
        thisDay, thisDayDate, lastKnownBudget;

      $data = this.getPurchases();
      deferred = $q.defer();

        $q.when($user, function (user) {
          //budget = user.budget;
          $q.when($data, function (purchaseData) {
            pdLen = purchaseData.length;

            if(!pdLen){
              deferred.resolve([]);
            }

            $log.log('purchaseData', purchaseData);
            startOfWeek = moment(date).startOf('isoWeek');
            endOfWeek = moment(date).endOf('isoWeek');

            $log.log(startOfWeek, endOfWeek);

            //collect the relevant purchases
            for (var i = 0; i < pdLen; i += 1) {
              thisPurchase = purchaseData[i];
              //thisPurchase.dateAdded = moment().utc(thisPurchase.dateAdded, 'DD-MM-YYYY').local();
              thisPurchase.dateAdded = moment(thisPurchase.dateAdded, 'YYYY-MM-DD').local();

              if (thisPurchase.dateAdded.isBetween(startOfWeek, endOfWeek)) {
                thisPurchase.dateAdded = thisPurchase.dateAdded;
                $log.log('thisPurchase', thisPurchase);
                weeksPurchases.push(thisPurchase);
              } else if(thisPurchase.dateAdded.isBefore(startOfWeek)){
                lastKnownBudget = thisPurchase.currentBudget;
              }

            }

            //group them by day
            wpCondensed = _.groupBy(weeksPurchases, 'dateAdded');
            $log.log('wpCondensed', wpCondensed);

            //make the value an array of amounts
            for (var prop in wpCondensed) {
              if (wpCondensed.hasOwnProperty(prop)) {
                wpCondensed[prop] = {amount: _.pluck(wpCondensed[prop], 'amount'), budget: _.pluck(wpCondensed[prop], 'currentBudget')};
                wpCondensed[prop].amount = _.sum(wpCondensed[prop].amount);
                wpCondensed[prop].budget = _.max(wpCondensed[prop].budget);
                wpCondensed[moment(prop).isoWeekday()] = angular.copy(wpCondensed[prop]);
                delete(wpCondensed[prop]);
              }
            }

            for (i = 0, thisDay = null, thisDayDate = null, amountSpent = 0; i < 7; i += 1) {
              thisDay = moment(startOfWeek); //get start of week
              thisDay.add(i, 'd'); //get day 1, day 2, each iteration of the loop, up to 7
              if (thisDay.isAfter(moment())) { //break from loop if dates are in the future
                break;
              }

              if(wpCondensed[i + 1]){
                amountSpent += wpCondensed[i + 1]['amount'] // +1 because isoWeekday is not zero based
                lastKnownBudget = budget = wpCondensed[i + 1]['budget'];
              } else {
                budget = lastKnownBudget || user.budget;
              }
              thisDayDate = thisDay.toDate();
              remValues.push({
                x: thisDayDate,
                y: budget - amountSpent,
                series: 0
              });
              spentValues.push({
                x: thisDayDate,
                y: amountSpent,
                series: 1
              });
            }

            deferred.resolve([{
              "key": "Remaining Budget",
              "values": remValues
            }, {
              "key": 'Amount Spent (in total)',
              "values": spentValues
            }]);
          });
        });

      return deferred.promise;

    }

    return {
      getPurchases: getPurchases,
      getBudgetInformation: getBudgetInformation
    };

  }

}());
