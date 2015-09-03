(function () {
    'use strict';

    angular.module('kitchenapp.services')
        .factory('Transaction', Transaction);

    Transaction.$inject = ['$q', '$resource', 'Auth', 'Ingredients', 'toastr', 'Cupboard', '$log', 'moment', '_'];

    function Transaction($q, $resource, Auth, Ingredients, toastr, Cupboard, $log, moment, _) {

      function getPurchases(){
        var user = Auth.getUser(),
            deferred = $q.defer();


            $resource('/api/users/:userid/purchases', {
                userid: user._id
            })
            .query(function (purchases) {
              $q.when(purchases, function(data){
                deferred.resolve(data);
              });
            });

            return deferred.promise;
      }

      function getBudgetInformation(date){

          var deferred, startOfWeek, endOfWeek, remValues = [], spentValues = [],
          budget = Auth.getUser().budget, data, weeksPurchases = [],
          pdLen, wpCondensed = [], thisPurchase, amountSpent = 0, thisDay;

          data = this.getPurchases();
          deferred = $q.defer();

          $q.when(data, function(purchaseData){
            pdLen = purchaseData.length;
            $log.log('purchaseData', purchaseData);
            startOfWeek = moment(date).startOf('isoweek');
            endOfWeek = moment(date).endOf('isoweek');

            $log.log(startOfWeek, endOfWeek);

            //collect the relevant purchases
            for(var i=0; i < pdLen; i+=1){
              thisPurchase = purchaseData[i];
              $log.log('thisPurchase', thisPurchase);
              if(moment(thisPurchase.dateAdded).isBetween(startOfWeek, endOfWeek)){
                weeksPurchases.push(thisPurchase);
              }
            }

            //group them by day
            wpCondensed = _.groupBy(weeksPurchases, 'dateAdded');
            $log.log('wpCondensed', wpCondensed);

            //make the value an array of amounts
            for(var prop in wpCondensed){
              if (wpCondensed.hasOwnProperty(prop)) {
                 wpCondensed[prop] = _.pluck(wpCondensed[prop], 'amount');
                 wpCondensed[prop] = _.sum(wpCondensed[prop]);
                 wpCondensed[moment(prop).isoWeekday()] = wpCondensed[prop];
                 delete(wpCondensed[prop]);
              }
            }


            for(i=0, thisDay = null, amountSpent = 0; i < 7; i+=1){
              thisDay = moment(startOfWeek);
              amountSpent += wpCondensed[i+1] || 0; // +1 because isoWeekday is not zero based
              thisDay.add(i, 'd');
              if(thisDay.isAfter(moment())){
                break;
              }
              remValues.push({
                x: thisDay.toDate(),
                y: budget - amountSpent,
                series: 0
              });
              spentValues.push({
                x: thisDay.toDate(),
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

          return deferred.promise;

      }

        return {
          getPurchases: getPurchases,
          getBudgetInformation: getBudgetInformation
        };

    }

}());
