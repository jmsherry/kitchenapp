'use strict';

angular.module('kitchenapp')
  .controller('BudgetCtrl', BudgetCtrl);

BudgetCtrl.$inject = ['Shopping', 'Transaction', 'Auth', '$q', 'Meals', '$log', '$scope'];

  function BudgetCtrl(Shopping, Transaction, Auth, $q, Meals, $log, $scope) {

    Auth.checkAuthorised();

    var vm = this,
    user = Auth.getUser(),
    budget = user.budget;

    var data = Transaction.getBudgetInformation();
$q.when(data, function(dada){
  var testdate = dada[0].values[0].x;
  $log.log('dada', dada, moment.isDate(testdate));
  $scope.data = dada;
});

    // $scope.data = [
    //   {
    //     "key": "Remaining Budget",
    //     "values": [
    //       { "x" : new Date(2015, 8, 17) , "y" : budget - 0, "series": 0},
    //       { "x" : new Date(2015, 8, 18) , "y" : budget - 10, "series": 0 },
    //       { "x" : new Date(2015, 8, 19) , "y" : budget - 20, "series": 0 },
    //       { "x" : new Date(2015, 8, 20) , "y" : budget -30, "series": 0 },
    //       { "x" : new Date(2015, 8, 21) , "y" : budget - 40, "series": 0 },
    //       { "x" : new Date(2015, 8, 22) , "y" : budget - 50, "series": 0 },
    //       { "x" : new Date(2015, 8, 23) , "y" : budget - 60, "series": 0 }
    //     ]
    //   }, {
    //     "key": 'Amount Spent so far',
    //     "values": [
    //       { "x" : new Date(2015, 8, 17) , "y" : 0, "series": 1 },
    //       { "x" : new Date(2015, 8, 18) , "y" : 10, "series": 1 },
    //       { "x" : new Date(2015, 8, 19) , "y" : 20, "series": 1 },
    //       { "x" : new Date(2015, 8, 20) , "y" : 30, "series": 1 },
    //       { "x" : new Date(2015, 8, 21) , "y" : 40, "series": 1 },
    //       { "x" : new Date(2015, 8, 22) , "y" : 50, "series": 1 },
    //       { "x" : new Date(2015, 8, 23) , "y" : 60, "series": 1 }
    //     ]
    //   }
    // ];

$scope.options = {
          chart: {
              type: 'multiBarChart',
              height: 450,
              margin : {
                  top: 20,
                  right: 20,
                  bottom: 60,
                  left: 65
              },
              clipEdge: true,
              staggerLabels: true,
              transitionDuration: 500,
              stacked: true,
              xAxis: {
                  axisLabel: 'Day',
                  showMaxMin: false,
                  tickFormat: function(d){
                    //console.log(d, moment(d), moment(d).format('dddd Do'));
                      return moment(d).format('dddd Do');
                  }
              },
              yAxis: {
                  axisLabel: 'Cost',
                  axisLabelDistance: 30,
                  tickFormat: function(d){
                      return '£' + d3.format(',.2f')(d);
                  }
              }
          }
      };

    angular.extend(vm, {
      name: 'BudgetCtrl'
    });


  }
