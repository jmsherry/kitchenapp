(function () {
    'use strict';

    angular.module('kitchenapp')
        .factory('Transaction', Transaction);

    Transaction.$inject = ['$q', '$resource', 'Auth', 'Ingredients', 'toastr', 'Cupboard', '$log', '$injector'];

    function Transaction($q, $resource, Auth, Ingredients, toastr, Cupboard, $log, $injector) {

      function getPurchases(){
        var self = this,
            user = Auth.getUser(),
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
      };

      function getBudgetInformation(date){

          var self = this, deferred, startOfWeek, endOfWeek, remValues = [], spentValues = [], dayObj = {},
          budget = Auth.getUser().budget, AmountSpent, data;

          data = self.getPurchases();
          deferred = $q.defer();

          $q.when(data, function(purchaseData){
            $log.log('purchaseData', purchaseData);
            startOfWeek = moment(date).startOf('isoweek');
            endOfWeek = moment(date).endOf('isoweek');

            $log.log(startOfWeek, endOfWeek);

            for(var i=0; i < 7; i+=1){
              dayObj.x = startOfWeek.add(i, 'd');
              remValues.push(dayObj);
              spentValues.push(dayObj);
            }

            for(var i=0; i < 7; i+=1){
              remValues[i].y = budget - AmountSpent;
              remValues[i].series = 0
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

        return {
          getPurchases: getPurchases,
          getBudgetInformation: getBudgetInformation
        };

    }

}());
