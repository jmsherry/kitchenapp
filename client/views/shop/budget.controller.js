(function(){
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('BudgetCtrl', BudgetCtrl);

  BudgetCtrl.$inject = ['Shopping', 'Transaction', 'Auth', '$q', 'Meals', '$log', '$scope', 'd3', 'moment'];

    function BudgetCtrl(Shopping, Transaction, Auth, $q, Meals, $log, $scope, d3, moment) {

      Auth.checkAuthorised();

      var vm = this,
      user = Auth.getUser(),
      budget = user.budget;

      var data = Transaction.getBudgetInformation();
      $q.when(data, function(dada){

        var testdate = dada[0].values[0].x;
        $log.log('dada', dada, moment.isDate(testdate));
        $scope.data = dada;

        d3.select(".nv-controlsWrap")
        .attr("transform","translate(-50,-50)");
      });

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
                staggerLabels: false,
                transitionDuration: 500,
                stacked: true,
                xAxis: {
                    axisLabel: 'Day',
                    axisLabelDistance: 0,
                    showMaxMin: false,
                    tickFormat: function(d){
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
        name: 'BudgetCtrl',
        budget: budget
      });


    }
}());
